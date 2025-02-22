import { UserObject } from '../../../discord/model/UserObject';
import { useDiscordContext } from '../../../discord/contexts/DiscordContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Link from 'next/link';
import { CloseMark } from '../Icons';
import UserRow from '../CreateChannelForm/UserRow';
import { JSX } from 'react';

type FormState = {
  users: UserObject[];
};

export default function CreateChannelForm(): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { client } = useChatContext();
  const { server } = useDiscordContext();
  const initialState: FormState = {
    users: [],
  };
  const [formData, setFormData] = useState<FormState>(initialState);
  const [users, setUsers] = useState<UserObject[]>([]);

  const loadUsers = useCallback(async () => {
    const response = await fetch('/api/users');
    const data = (await response.json())?.data as UserObject[];
    if (data) setUsers(data);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <dialog className='absolute z-10 space-y-2 rounded-xl' ref={dialogRef}>
      <div className='w-full flex items-center justify-between py-8 px-6'>
        <h2 className='text-3xl font-semibold text-gray-600'>Default Channel</h2>
        <Link href='/'>
          <CloseMark className='w-10 h-10 text-gray-400' />
        </Link>
      </div>
      <form method='dialog' className='flex flex-col space-y-4 px-6'>
        <h2 className='mb-2 labelTitle'>Add Users</h2>
        <div className='max-h-64 overflow-y-scroll'>
          {users.map((user) => (
            <UserRow user={user} userChanged={userChanged} key={user.id} />
          ))}
        </div>
      </form>
      <div className='flex space-x-6 items-center justify-end p-6 bg-gray-200'>
        <Link href={'/'} className='font-semibold text-gray-500'>
          Cancel
        </Link>
      </div>
    </dialog>
  );

  function userChanged(user: UserObject, checked: boolean) {
    if (checked) {
      setFormData({
        ...formData,
        users: [...formData.users, user],
      });
    } else {
      setFormData({
        ...formData,
        users: formData.users.filter((thisUser) => thisUser.id !== user.id),
      });
    }
  }
}
