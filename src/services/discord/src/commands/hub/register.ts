import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { apiError, hub, hubData } from '../../types';
import { MessageFlags } from 'discord.js';

export class TickrateCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      // TODO: add limit precondition
      // preconditions: [],
      registerSubCommand: {
        // parentCommandName: import.meta.dir.split('/').pop(),
        parentCommandName: 'hub',
        slashSubcommand: (builder) =>
          builder
            .setName('register')
            .setDescription('Create a new hub.')
            .addStringOption((option) =>
              option
                .setName('hubname')
                .setDescription('What the hub should be called.')
                .setRequired(true),
            ),
      },
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const hubnameStr = interaction.options.getString('hubname');
    const body: hubData = {
      appName: 'discord',
      ownerID: interaction.user.id,
      name: `${interaction.id}_${hubnameStr}`,
    };
    const apiResponse = await fetch(`${process.env.apiEndpoint}/v1/hubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const response: apiError | hub = await apiResponse.json();

    if (!apiResponse.ok) {
      const apiErrorResponse = response as apiError;
      if (apiErrorResponse.error && apiErrorResponse.error.message === 'Hub name too long')
        return interaction.editReply(`⚠️ Your hub name is too long. Try something shorter.`);
      await interaction.editReply('⚠️ Some error occurred. Try again later');
      return this.container.logger.error(
        `⚠️ ${interaction.commandName} register - ${apiResponse.status} - ${apiResponse.statusText}`,
      );
    }

    const hubResponse = response as hub;
    interaction.editReply(`
You created \`${hubResponse.name}\`

You can now link channels on supported platforms by using \`/${interaction.commandName} join\`.
**Treat this name as an invite to add channels.**`);
  }
}
