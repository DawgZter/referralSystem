import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CommandInteraction,
    EmbedBuilder,
    GuildMember
} from "discord.js";
import MyClient from "../lib/types/class/MyClient";
import InviteStats from "../lib/types/interface/InviteStats";
import inviteSync from "../lib/sync/invite";
import undefMember from "../lib/utils/undefMember";
import config from "../config";

export default {
    name: "invites",
    description: "View invitations",
    options: [
        {
            name: "member",
            description: "Mention a server member",
            type: ApplicationCommandOptionType.Mentionable,
            required: false
        }
    ],
    type: ApplicationCommandType.ChatInput,
    async run(interaction: CommandInteraction, client: MyClient) {
        const member: GuildMember = interaction.options.get("member")?.member as GuildMember || interaction.member as GuildMember;
        if (member === undefined) return undefMember(interaction, client);

        try {
            const invites: InviteStats = await inviteSync.getInvites(member.user.id, interaction.guildId!);

            const embed = new EmbedBuilder()
                .setTitle("Invitation Stats")
                .setDescription(`
                    ${interaction.member!.user.id === member.user.id ?
                    `Congratulations, **${member.user.tag}**! You have **${invites.invites}** invitations. \n\n_Here's a breakdown of your invitations:_\n\n**${invites.total}** Regular Invitations\n**${invites.leaves}** Left Invitations\n**${invites.bonus}** Bonus Invitations` :
                    `**${member.user.tag}** has **${invites.invites}** invitations. \n\n_Here's a breakdown of their invitations:_\n\n**${invites.total}** Regular Invitations\n**${invites.leaves}** Left Invitations\n**${invites.bonus}** Bonus Invitations`}
                `)
                .setFooter({text: config.message.footer, iconURL: client.user!.displayAvatarURL()})
                .setColor("DarkGreen")
            return interaction.editReply({embeds: [embed]});
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription(`
                    ${interaction.member!.user.id === member.user.id ?
                    `Unable to retrieve your invitations, **${member.user.tag}**.` :
                    `Unable to retrieve invitations from **${member.user.tag}** for **${interaction.member!.user.username + "#" + interaction.member!.user.discriminator}**.`}
                `)
                .setFooter({text: config.message.footer, iconURL: client.user!.displayAvatarURL()})
                .setColor("Red")
            if (config.handleError) embed.addFields({name: "Console", value: error as string})
            return interaction.editReply({embeds: [embed]});
        }
    }
}
