import { createCanvas, loadImage } from 'canvas';

import { blur } from '../../../utils/canvas';

import type { TextCommand } from '../../../sturctures/command';

export const command: TextCommand = {
  data: {
    name: 'trash',
    description: 'TRAshh.',
    directMessageAllowed: true,
    cooldownInterval: 10 * 1000,
  },
  run: async ({ message, args }) => {
    const { attachments, author, guild, channel } = message;

    let image = attachments.first()?.proxyURL;

    for (let index = 0; index < 2; index++) {
      if (image) break;

      if (index === 1) {
        image = author.displayAvatarURL({
          dynamic: false,
          format: 'png',
          size: 256,
        });
        break;
      }

      if (guild && args[0]) {
        if (args[0].length >= 18) {
          const idMember = guild.members.cache.get(args[0]);
          if (idMember) {
            image = idMember.user.displayAvatarURL({
              dynamic: false,
              format: 'png',
            });
          }
        } else {
          const username = String(args[0]).toLowerCase();
          const target = guild.members.cache.find(ur =>
            ur.user.username.toLowerCase().includes(username),
          );
          if (target) {
            image = target.user.displayAvatarURL({
              dynamic: false,
              format: 'png',
            });
          }
        }
      }
    }

    if (!image) return;

    const blurredImg = await blur(image);

    const targetImage = await loadImage(blurredImg);
    const background = await loadImage('./assets/trash.png');

    const canvas = createCanvas(background.width, background.height);
    const context = canvas.getContext('2d');

    context.drawImage(background, 0, 0);
    context.drawImage(targetImage, 309, 0, 309, 309);

    channel.send({
      files: [
        { name: `${Date.now()}_trash.png`, attachment: canvas.toBuffer() },
      ],
    });
  },
};