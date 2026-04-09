import { Command } from '@kaname-png/plugin-subcommands-advanced';
import { MessageFlags } from 'discord.js';
import { hub } from '../../types';

export class TickrateCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      // preconditions: [],
      registerSubCommand: {
        parentCommandName: 'hub',
        slashSubcommand: (builder) =>
          builder.setName('list').setDescription('Show all the hubs you manage.'),
      },
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const apiResponse = await fetch(
      `${process.env.apiEndpoint}/v1/hubs?appName=discord&ownerId=${interaction.user.id}`,
    );
    const apiStatus = `${process.env.NODE_ENV === 'development' ? `: ${apiResponse.statusText}` : ''}`;
    if (!apiResponse.ok) {
      if (apiResponse.status === 404)
        return interaction.editReply(
          `⚠️ You don't have any hubs. Try creating one with \`/${interaction.commandName} register\``,
        );
      await interaction.editReply('⚠️ Some error occurred. Try again later');
      return this.container.logger.error(`⚠️ ${interaction.commandName} list - ${apiResponse.status} - ${apiResponse.statusText}`);
    }
    const response = (await apiResponse.json()) as hub[];
    const names = response.map((entry) => `• \`${entry.name}\``).join('\n');
    interaction.editReply(`**Your hubs:**\n${names}`);
  }
}
