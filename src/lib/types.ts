export interface User {
  id: string;
  bot: boolean;
  avatar: string | null;
  username: string;
  displayName: string;
  discriminator: string;
}

export interface Command {
  name: string;
  description: string;
  category: string;
  subcommands: SubCommand[] | null;
}

interface SubCommand {
  name: string;
}
