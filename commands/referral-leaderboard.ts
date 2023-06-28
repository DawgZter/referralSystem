import {
    ApplicationCommandType,
    CommandInteraction,
    EmbedBuilder,
    Snowflake
} from "discord.js";
import MyClient from "../lib/types/class/MyClient";
import inviteSync from "../lib/sync/invite";
import config from "../config";
import { LeaderboardStats } from "../lib/types/interface/invite";

export default {
    name: "referral-leaderboard",
    description: "View referral leaderboard",
    type: ApplicationCommandType.ChatInput,
    async run(interaction: CommandInteraction, client: MyClient) {
        try {
            const leaderboard: LeaderboardStats = await inviteSync.leaderboard(interaction.guildId!);

            if (Object.keys(leaderboard).length <= 0) {
                const embed = new EmbedBuilder()
                    .setTitle("Success!")
                    .setDescription(`**${interaction.member}** there are currently **no users with invitations** on this server.`)
                    .setFooter({ text: config.message.footer, iconURL: client.user!.displayAvatarURL() })
                    .setColor("DarkGreen")
                return interaction.editReply({ embeds: [embed] });
            }

            const orderedLeaderboard = await Promise.all(Object.entries(leaderboard)
                .sort((a, b) => b[1] - a[1])
                .map(async ([key, value], i) => {
                    const user = await client.users.fetch(key).catch(() => undefined);

                    return `**${i + 1}) ${user}** has **${value}** invitations`;
                }))

            const top5 = orderedLeaderboard.slice(0, 5);

            const embed = new EmbedBuilder()
                .setTitle("Invitation Leaderboard")
                .setDescription(`Guild: **${interaction.guild!.name}**\n\n${top5.join("\n")}`)
                .setFooter({ text: config.message.footer, iconURL: client.user!.displayAvatarURL() })
                .setColor("DarkGreen")
            return interaction.editReply({ embeds: [embed] });
        } catch (error: any) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription(`**${interaction.member}** unable to **retrieve** the leaderboard.`)
                .setFooter({ text: config.message.footer, iconURL: client.user!.displayAvatarURL() })
                .setColor("Red")
            if (config.handleError) embed.addFields({ name: "Console", value: error.message })
            return interaction.editReply({ embeds: [embed] });
        }
    }
}
