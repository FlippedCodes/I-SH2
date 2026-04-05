import { Listener } from '@sapphire/framework';

import { type Client, Events, Constants } from 'discord.js';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: Events.ClientReady,
    });
  }

  public async run(client: Client) {
    const body = {
      name: 'discord',
      features: {
        tosLink: 'https://discord.com/terms',
        privacyPolicyLink: 'https://discord.com/privacy',
        textLength: 2000,
        trackMessage: true,
        deleteMessage: true,
        deleteMessageTime: Constants.MaxBulkDeletableMessageAge,
        inviteLinks: true,
        webhookSupport: true,
        media: true,
        mediaStickers: true,
        mediaEmojis: true,
      },
    };

    const apiResponse = await fetch(`${process.env.apiEndpoint}/v1/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!apiResponse.ok)
      throw new Error(`⚠️ Unable to register the App with the API: ${apiResponse.statusText}`);

    const response = await apiResponse.json();
    switch (apiResponse.status) {
      case 201:
        this.container.logger.info(
          `✅ Successfully registered App with API! AppID: ${response.id}`,
        );
        break;
      case 200:
        this.container.logger.info(
          `✅ Successfully updated existing App in API! AppID: ${response.id}`,
        );
        break;
      default:
        return this.container.logger.fatal(`⚠️ Unknown return code: ${response}`);
    }
  }
}
