'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function LoginAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogin = async () => {
    console.log(session)
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false
      })
      if (res.error) {
        setError("Invalid credentials");
        return;
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user === "llccxmiller") {
        router.push("/admin/dashboard")
      }
    }
  })

  return (
    <div className="max-w-screen-sm mx-auto mt-40 p-5">
      <Card>
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button color="primary" onClick={handleLogin}>
            Login
          </Button>
          {/* <Button color="danger" onPress={() => signOut()}>
            Logout
          </Button> */}
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginAdminPage;