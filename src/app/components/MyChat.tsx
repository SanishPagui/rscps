'use client';

import { useClient } from '../discord/hooks/useClient';
import { User } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';

import ServerList from '../components/ServerList/ServerList';
import MessageComposer from './MessageList/MessageComposer/MessageComposer';
import CustomDateSeparator from './MessageList/CustomDateSeparator/CustomDareSeparator';
import CustomMessage from './MessageList/CustomMessage/CustomMessage';
import { customReactionOptions } from './MessageList/CustomReactions/CustomReactionsSelector';
import CustomChannelHeader from './MessageList/CustomChannelHeader/CustomChannelHeader';
import { useDiscordContext } from '../discord/contexts/DiscordContext';
import { useEffect, useState } from 'react';
import { Channel as ChannelType } from 'stream-chat';

export default function MyChat({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: User;
  token: string;
}) {
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider: token,
  });

  const { server } = useDiscordContext();
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(null);

  useEffect(() => {
    const initializeChannel = async () => {
      if (!chatClient || !server) return;

      // Get or create a single channel for the server
      const channel = chatClient.channel('messaging', server.name, {
        name: server.name,
        members: [user.id],
        data: {
          server: server.name,
          image: server.image
        },
      });

      try {
        await channel.watch();
        setCurrentChannel(channel);
      } catch (error) {
        console.error('Error initializing channel:', error);
      }
    };

    initializeChannel();
  }, [chatClient, server, user.id]);

  if (!chatClient) {
    return <div>Error, please try again later.</div>;
  }

  if (!currentChannel) {
    return <div>Loading channel...</div>;
  }

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <section className='flex h-screen w-screen layout'>
        <ServerList />
        <Channel
          channel={currentChannel}
          Message={CustomMessage}
          Input={MessageComposer}
          DateSeparator={CustomDateSeparator}
          reactionOptions={customReactionOptions}
          HeaderComponent={CustomChannelHeader}
        >
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </section>
    </Chat>
  );
}