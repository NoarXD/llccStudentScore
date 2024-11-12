'use client'

import React, { useEffect } from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

function AdminDashboardPage() {
    const router = useRouter()

    return (
        <div>
            <AdminNavbar />
            <div className='max-w-screen-sm mt-20 mx-auto'>
                <Card className='p-5'>
                    <CardHeader className='flex justify-center'>
                        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
                    </CardHeader>
                    <hr className='py-3' />
                    <CardBody className='flex flex-col gap-4'>
                        <Button color="primary" onClick={() => router.push('/admin/dashboard/addingstudent')}>
                            ເພີ່ມລາຍຊື່ນັກຮຽນ
                        </Button>
                        <Button color="primary" onClick={() => router.push('/admin/dashboard/studentscore')}>
                            ແກ້ໄຂຄະແນນນັກຮຽນ
                        </Button>
                        <Button color="primary" onClick={() => router.push('/admin/dashboard/editstudent')}>
                            ຈັດການຂໍ້ມູນນັກຮຽນ
                        </Button>
                        <Button color="danger" onClick={() => signOut()}>
                            ອອກຈາກລະບົບ
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboardPage