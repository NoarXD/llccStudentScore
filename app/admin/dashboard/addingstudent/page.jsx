'use client'

import React, { useState, useEffect } from 'react'
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem } from "@nextui-org/react"
import AdminNavbar from '../../../components/AdminNavbar'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Head from 'next/head'


function AddingStudentPage() {
  const [firstNameEng, setFirstNameEng] = useState('');
  const [lastNameEng, setLastNameEng] = useState('');
  const [firstNameLao, setFirstNameLao] = useState('');
  const [lastNameLao, setLastNameLao] = useState('');
  const [gen, setGen] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false)
  const handleSubmit = async () => {
    setIsDisabled(true)
    try {
      if (!gender || !firstNameEng || !lastNameEng || !firstNameLao || !lastNameLao || !gen || !birthday) {
        Swal.fire({
          icon: "error",
          title: "ບໍ່ສຳເລັດ",
          text: "ກະລຸນາປ້ອນຂໍ້ມູນທັງຫມົດ",
        });
        return;
      }
      const response = await fetch('/api/student/addingstudent', {
        method: 'POST',
        body: JSON.stringify({ gender, firstNameEng, lastNameEng, firstNameLao, lastNameLao, gen, birthday }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFirstNameEng('');
        setLastNameEng('');
        setFirstNameLao('');
        setLastNameLao('');
        setGen('');
        setGender('');
        setBirthday('');
        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ຂໍ້ມູນນັກຮຽນໄດ້ຖືກບັນທຶກແລ້ວ",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ບໍ່ສຳເລັດ",
          text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນນັກຮຽນ",
        });
      }
    } catch (error) {
    }
    setIsDisabled(false)
  }

  return (
    <div>
      <Head>
        <title>ຟອມເພີ່ມຂໍ້ມູນນັກຮຽນ</title>
      </Head>
      <AdminNavbar />
      <div className="max-w-screen-sm mx-auto mt-10 p-5">
        <Card>
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl font-bold">ຟອມເພີ່ມຂໍ້ມູນນັກຮຽນ</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Select
              label="ເພດ"
              placeholder="ກະລຸນາເລືອກເພດ"
              onChange={(e) => setGender(e.target.value)}
            >
              <SelectItem key="male" value="male">ຊາຍ</SelectItem>
              <SelectItem key="female" value="female">ຍິງ</SelectItem>
            </Select>
            <div className='flex gap-3'>
              <Input
                type="text"
                label="ຊື່ພາສາອັງກິດ"
                placeholder="ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ"
                value={firstNameEng}
                onChange={(e) => setFirstNameEng(e.target.value)}
              />
              <Input
                type="text"
                label="ນາມສະກຸນພາສາອັງກິດ"
                placeholder="ກະລຸນາປ້ອນນາມສະກຸນພາສາອັງກິດ"
                value={lastNameEng}
                onChange={(e) => setLastNameEng(e.target.value)}
              />
            </div>
            <div className='flex gap-3'>
              <Input
                type="text"
                label="ຊື່ພາສາລາວ"
                placeholder="ກະລຸນາປ້ອນຊື່ພາສາລາວ"
                value={firstNameLao}
                onChange={(e) => setFirstNameLao(e.target.value)}
              />
              <Input
                type="text"
                label="ນາມສະກຸນພາສາລາວ"
                placeholder="ກະລຸນາປ້ອນນາມສະກຸນພາສາລາວ"
                value={lastNameLao}
                onChange={(e) => setLastNameLao(e.target.value)}
              />
            </div>
            <Input
              type="number"
              label="ລຸ່ນ"
              placeholder="ກະລຸນາປ້ອນລຸ່ນ"
              value={gen}
              onChange={(e) => setGen(e.target.value)}
            />
            <Input
              type="date"
              label="ວັນເດືອນປີເກີດ"
              placeholder="ກະລຸນາປ້ອນວັນເດືອນປີເກີດ"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <div className="flex justify-between">
              <Button disabled={isDisabled} color="primary" onClick={handleSubmit}>
                ບັນທຶກຂໍ້ມູນ
              </Button>
              <Button color="danger" onClick={() => router.push('/admin/dashboard')}>
                ອອກ
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AddingStudentPage