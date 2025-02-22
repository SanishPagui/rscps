'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';

export interface DiscordServer {
  name: string;
  image: string;
}

interface DiscordContextType {
  server?: DiscordServer;
  changeServer: (server: DiscordServer | undefined, client: StreamChat) => Promise<void>;
  createServer: (
    client: StreamChat,
    name: string,
    imageUrl: string,
    userIds: string[]
  ) => Promise<void>;
}

const initialValue: DiscordContextType = {
  server: undefined,
  changeServer: async () => {},
  createServer: async () => {},
};

const DiscordContext = createContext<DiscordContextType>(initialValue);

export const DiscordContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [server, setServer] = useState<DiscordServer | undefined>(undefined);

  const changeServer = useCallback(
    async (server: DiscordServer | undefined, client: StreamChat) => {
      setServer(server);
    },
    []
  );

  const createServer = useCallback(
    async (
      client: StreamChat,
      name: string,
      imageUrl: string,
      userIds: string[]
    ) => {
      try {
        const channel = client.channel('messaging', name, {
          name: name,
          members: userIds,
          data: {
            image: imageUrl,
            server: name,
          },
        });

        await channel.create();
        
        const newServer: DiscordServer = {
          name,
          image: imageUrl,
        };
        
        setServer(newServer);
      } catch (error) {
        console.error('[DiscordContext] Error creating server:', error);
      }
    },
    []
  );

  const store: DiscordContextType = {
    server,
    changeServer,
    createServer,
  };

  return (
    <DiscordContext.Provider value={store}>
      {children}
    </DiscordContext.Provider>
  );
};

export const useDiscordContext = () => useContext(DiscordContext);