'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import UserCards from '~/components/UserCards';
import { useEffect, useState } from 'react';
import { UserApi } from '~/servers/user';

export default function PageComponent(p: { locale }) {
  const [userList, setUserList] = useState([] as UserInfo[]);

  useEffect(() => {
    async function getUserList() {
      const user = await UserApi.getUsers();
      setUserList(user);
    }
    getUserList();
  }, []);

  return (
    <>
      <HeadInfo locale={p.locale} title={'CarbonTraderManagement'} description={'CarbonTraderManagement'} />
      <Header locale={p.locale} />

      <UserCards users={userList} />

      <Footer locale={p.locale} />
    </>
  );
}
