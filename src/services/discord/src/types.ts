export type hub = {
  id: number;
  name: string;
};

export type hubData = {
  appName: 'discord';
  ownerID: string;
  name: string;
};

export type apiError = {
  success: false;
  error?: {
    message: string;
  }
  message?: {
    name: string;
    message: string;
  };
};
