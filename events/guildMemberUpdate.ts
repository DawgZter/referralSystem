import { Events, GuildMember } from "discord.js";
import MyClient from "../lib/types/class/MyClient";
import connection from "../database/connection";

export default {
    once: false,
    name: Events.GuildMemberUpdate,
    async execute(oldMember: GuildMember, newMember: GuildMember, client: MyClient) {
        const memberRole = newMember.guild.roles.cache.find(role => role.name === "member");
        if (!memberRole) return;
        
        if (!oldMember.roles.cache.has(memberRole.id) && newMember.roles.cache.has(memberRole.id)) {
            // The member role has been added, update the database
            connection.mysql.query(`
                UPDATE invites 
                SET inactive = 0 
                WHERE user = '${newMember.id}' AND guild = '${newMember.guild.id}' AND inactive = 1
            `, (error, results) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(`Updated ${results.affectedRows} rows`);
                }
            });
        }
    }
};
