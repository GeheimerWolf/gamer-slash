import { avatarURL, DiscordApplicationCommandOptionTypes, snowflakeToBigint } from "../../../deps.ts";
import translate from "../../languages/translate.ts";
import { Embed } from "../../utils/Embed.ts";
import { Command } from "../mod.ts";

const command: Command = {
  global: true,
  options: [
    {
      required: false,
      name: "AVATAR_USER_NAME",
      description: "AVATAR_USER_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.User,
    },
  ],
  execute: function (payload) {
    const arg = payload.data?.options?.[0];
    const userId = (arg?.value || "") as string;
    const targetUser = payload.data?.resolved?.users?.[userId] ||
      payload.member?.user || payload.user!;

    const url = avatarURL(
      snowflakeToBigint(targetUser.id),
      snowflakeToBigint(targetUser.discriminator),
      { avatar: targetUser.avatar!, animated: true, size: 2048 },
    );

    const embed = new Embed().setAuthor(
      `${targetUser.username}#${targetUser?.discriminator}`,
      targetUser,
    ).setDescription(
      `[${translate(payload.guildId!, "AVATAR_DOWNLOAD_LINK")}](${url})`,
    ).setImage(targetUser);

    if (arg?.value) {
      if (!targetUser) {
        return { content: translate(payload.guildId!, "MISSING_MEMBER") };
      }

      return { embeds: [embed] };
    }

    if (!payload.member) {
      return { content: translate(payload.guildId!, "MISSING_MEMBER") };
    }

    return { embeds: [embed] };
  },
};

export default command;
