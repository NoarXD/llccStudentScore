'use client'

import React, { useState, useEffect } from 'react'
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem } from "@nextui-org/react"
import AdminNavbar from '../../../components/AdminNavbar'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Head from 'next/head'

function AddingStudentPage() {
  const [nameEng, setNameEng] = useState('');
  const [nameLao, setNameLao] = useState('');
  const [gen, setGen] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const router = useRouter();
  const handleSubmit = async () => {
    console.log(gender, nameEng, nameLao, gen);
    try {
      if (!gender || !nameEng || !nameLao || !gen || !birthday) {
        Swal.fire({
          icon: "error",
          title: "ບໍ່ສຳເລັດ",
          text: "ກະລຸນາປ້ອນຂໍ້ມູນທັງຫມົດ",
        });
        return;
      }
      const response = await fetch('/api/student/addingstudent', {
        method: 'POST',
        body: JSON.stringify({ gender, nameEng, nameLao, gen, birthday }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setNameEng('');
        setNameLao('');
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
              isRequired
            >
              <SelectItem key="male" value="male">ຊາຍ</SelectItem>
              <SelectItem key="female" value="female">ຍິງ</SelectItem>
            </Select>
            <Input
              type="text"
              label="ຊື່ພາສາອັງກິດ"
              placeholder="ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ"
              value={nameEng}
              onChange={(e) => setNameEng(e.target.value)}
              isRequired
            />
            <Input
              type="text"
              label="ຊື່ພາສາລາວ"
              placeholder="ກະລຸນາປ້ອນຊື່ພາສາລາວ"
              value={nameLao}
              onChange={(e) => setNameLao(e.target.value)}
              isRequired
            />
            <Input
              type="number"
              label="ລຸ່ນ"
              placeholder="ກະລຸນາປ້ອນລຸ່ນ"
              value={gen}
              onChange={(e) => setGen(e.target.value)}
              isRequired
            />
            <Input
              type="date"
              label="ວັນເດືອນປີເກີດ"
              placeholder="ກະລຸນາປ້ອນວັນເດືອນປີເກີດ"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              isRequired
            />
            <div className="flex justify-between">
              <Button color="primary" onClick={handleSubmit}>
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