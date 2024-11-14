'use client'

import React, { useState, useEffect } from 'react'
import AdminNavbar from '../../../components/AdminNavbar'
import { Card, CardHeader, CardBody, Input, Select, SelectItem, Button, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

function EditStudentPage() {
    const [searchMethod, setSearchMethod] = useState('self')
    const [firstNameEng, setFirstNameEng] = useState('')
    const [lastNameEng, setLastNameEng] = useState('')
    const [firstNameLao, setFirstNameLao] = useState('')
    const [lastNameLao, setLastNameLao] = useState('')
    const [gen, setGen] = useState('')
    const [gender, setGender] = useState('')
    const [studentId, setStudentId] = useState('')
    const router = useRouter()
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [page, setPage] = useState(1)
    const rowsPerPage = 15
    const { isOpen: isManageStudent, onOpen: onManageStudent, onOpenChange: onManageStudentChange } = useDisclosure()
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [newFirstNameEng, setNewFirstNameEng] = useState('')
    const [newLastNameEng, setNewLastNameEng] = useState('')
    const [newFirstNameLao, setNewFirstNameLao] = useState('')
    const [newLastNameLao, setNewLastNameLao] = useState('')
    const [newGen, setNewGen] = useState('')
    const [newGender, setNewGender] = useState('')
    const [newBirthday, setNewBirthday] = useState('')

    const fetchStudents = async () => {
        try {
            const res = await fetch(`/api/student`);
            if (!res.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await res.json();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleUpdateStudent = async (studentId) => {
        console.log(typeof newBirthday)
        console.log(newBirthday)
        try {
            const res = await fetch(`/api/student/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentId: studentId, firstNameEng: newFirstNameEng, lastNameEng: newLastNameEng, firstNameLao: newFirstNameLao, lastNameLao: newLastNameLao, gen: newGen, gender: newGender, birthday: newBirthday })
            })
            if (!res.ok) {
                throw new Error('Failed to update student');
            }
            fetchStudents()
            onManageStudentChange(false)
            Swal.fire({
                icon: "success",
                title: "ສຳເລັດ",
                text: "ຂໍ້ມູນນັກຮຽນຖືກບັນທຶກແລ້ວ",
            });
        } catch (error) {
            console.error('Error updating student:', error);
            Swal.fire({
                icon: "error",
                title: "ບໍ່ສຳເລັດ",
                text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນນັກຮຽນ",
            });
        }
    }

    const handleSearch = () => {
        let filtered = [...students];

        if (searchMethod === 'studentId' && studentId) {
            filtered = filtered.filter(student =>
                student.studentId.toLowerCase().includes(studentId.toLowerCase())
            );
        }
        else if (searchMethod === 'self') {
            if (firstNameEng) {
                filtered = filtered.filter(student =>
                    student.firstNameEng.toLowerCase().includes(firstNameEng.toLowerCase())
                );
            }
            if (firstNameLao) {
                filtered = filtered.filter(student =>
                    student.firstNameLao.toLowerCase().includes(firstNameLao.toLowerCase())
                );
            }
            if (gen) {
                filtered = filtered.filter(student =>
                    student.gen.toString() === gen
                );
            }
            if (gender) {
                filtered = filtered.filter(student =>
                    student.gender.toLowerCase() === gender.toLowerCase()
                );
            }
        }

        setFilteredStudents(filtered);
        setPage(1);
    }

    const handleManageStudent = (studentId) => {
        const student = students.find(s => s.studentId === studentId);
        if (student) {
            setSelectedStudent(student);
            setNewFirstNameEng(student.firstNameEng);
            setNewLastNameEng(student.lastNameEng);
            setNewFirstNameLao(student.firstNameLao);
            setNewLastNameLao(student.lastNameLao);
            setNewGen(student.gen);
            setNewGender(student.gender);
            setNewBirthday(student.birthday ? new Date(student.birthday).toISOString().split('T')[0] : '');
            onManageStudent();
        }
    }

    const handleDeleteStudent = async (studentId) => {
        try {
            Swal.fire({
                title: "ຢືນຢັນການລົບລາຍຊື່ນັກຮຽນ",
                text: "ກະລຸນາຢືນຢັນການລົບລາຍຊື່ນັກຮຽນ",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonText: "ຍົກເລີກ",
                cancelButtonColor: "#d33",
                confirmButtonText: "ຢືນຢັນ"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await fetch(`/api/student/delete`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ studentId })
                    })
                    if (!res.ok) {
                        throw new Error('Failed to delete student');
                    }
                    fetchStudents()
                    Swal.fire({
                        title: "ລົບລາຍຊື່ນັກຮຽນສຳເລັດ",
                        text: "ລາຍຊື່ນັກຮຽນຖືກລົບແລ້ວ",
                        icon: "success"
                    });
                }
            });


        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }

    const pages = Math.ceil(filteredStudents.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredStudents.slice(start, end);
    }, [page, filteredStudents]);
    return (
        <>
            <AdminNavbar />
            <div className='max-w-screen-xl mx-auto mt-10 p-5'>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <h1 className='text-2xl font-bold'>ຈັດການຂໍ້ມູນນັກຮຽນ</h1>
                    </CardHeader>
                    <CardBody className='flex flex-col gap-4'>
                        <Select
                            label="ວິທີການຄົ້ນຫາ"
                            placeholder="ກະລຸນາເລືອກວິທີການຄົ້ນຫາ"
                            onChange={(e) => setSearchMethod(e.target.value)}>
                            <SelectItem key="self" value="self">ຄົ້ນຫາດ້ວຍໂຕເອງ</SelectItem>
                            <SelectItem key="studentId" value="studentId">ຄົ້ນຫາດ້ວຍລະຫັດນັກຮຽນ</SelectItem>
                        </Select>
                        {searchMethod === 'self' && (
                            <>
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
                                        label="ຊື່ພາສາລາວ"
                                        placeholder="ກະລຸນາປ້ອນຊື່ພາສາລາວ"
                                        value={firstNameLao}
                                        onChange={(e) => setFirstNameLao(e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="number"
                                    label="ລຸ່ນ"
                                    placeholder="ກະລຸນາປ້ອນລຸ່ນ"
                                    value={gen}
                                    onChange={(e) => setGen(e.target.value)}
                                />
                                <Select
                                    label="ເພດ"
                                    placeholder="ກະລຸນາເລືອກເພດ"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}>
                                    <SelectItem key="male" value="male">ຊາຍ</SelectItem>
                                    <SelectItem key="female" value="female">ຍິງ</SelectItem>
                                </Select>
                            </>
                        )}
                        {searchMethod === 'studentId' && (
                            <Input
                                type="text"
                                label="ລະຫັດນັກຮຽນ"
                                placeholder="ກະລຸນາປ້ອນລະຫັດນັກຮຽນ"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        )}
                        <div className="flex justify-between">
                            <Button color="primary" onClick={handleSearch}>
                                ຄົ້ນຫາຂໍ້ມູນນັກຮຽນ
                            </Button>
                            <Button color="danger" onClick={() => router.push('/admin/dashboard')}>
                                ອອກ
                            </Button>
                        </div>

                        <Table aria-label="Student table">
                            <TableHeader>
                                <TableColumn>ລະຫັດນັກຮຽນ</TableColumn>
                                <TableColumn>ຊື່ພາສາອັງກິດ</TableColumn>
                                <TableColumn>ນາມສະກຸນພາສາອັງກິດ</TableColumn>
                                <TableColumn>ຊື່ພາສາລາວ</TableColumn>
                                <TableColumn>ນາມສະກຸນພາສາລາວ</TableColumn>
                                <TableColumn>ເພດ</TableColumn>
                                <TableColumn>ລຸ່ນ</TableColumn>
                                <TableColumn>ວັນເກີດ</TableColumn>
                                <TableColumn>ຈັດການ</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell>ບໍ່ພົບຂໍ້ມູນນັກຮຽນທີ່ຄົ້ນຫາ</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{""}</TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((student) => (
                                        <TableRow key={student._id}>
                                            <TableCell>{student.studentId}</TableCell>
                                            <TableCell>{student.firstNameEng}</TableCell>
                                            <TableCell>{student.lastNameEng}</TableCell>
                                            <TableCell>{student.firstNameLao}</TableCell>
                                            <TableCell>{student.lastNameLao}</TableCell>
                                            <TableCell>{student.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}</TableCell>
                                            <TableCell>{student.gen}</TableCell>
                                            <TableCell>{new Date(student.birthday).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleManageStudent(student.studentId)} size="sm" color="primary">
                                                    ຈັດການ
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex justify-center">
                            <Pagination
                                total={pages}
                                page={page}
                                onChange={setPage}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Modal size="2xl" isOpen={isManageStudent} placement="center" onOpenChange={onManageStudentChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ຈັດການຂໍ້ມູນນັກຮຽນ {selectedStudent?.firstNameEng} {selectedStudent?.lastNameEng}</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="text"
                                        label="ຊື່ພາສາອັງກິດ"
                                        placeholder="ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ"
                                        value={newFirstNameEng}
                                        onChange={(e) => setNewFirstNameEng(e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        label="ນາມສະກຸນພາສາອັງກິດ"
                                        placeholder="ກະລຸນາປ້ອນນາມສະກຸນພາສາອັງກິດ"
                                        value={newLastNameEng}
                                        onChange={(e) => setNewLastNameEng(e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        label="ຊື່ພາສາລາວ"
                                        placeholder="ກະລຸນາປ້ອນຊື່ພາສາລາວ"
                                        value={newFirstNameLao}
                                        onChange={(e) => setNewFirstNameLao(e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        label="ນາມສະກຸນພາສາລາວ"
                                        placeholder="ກະລຸນາປ້ອນນາມສະກຸນພາສາລາວ"
                                        value={newLastNameLao}
                                        onChange={(e) => setNewLastNameLao(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        label="ລຸ່ນ"
                                        placeholder="ກະລຸນາປ້ອນລຸ່ນ"
                                        value={newGen}
                                        onChange={(e) => setNewGen(e.target.value)}
                                    />
                                    <Select
                                        label="ເພດ"
                                        placeholder="ກະລຸນາເລືອກເພດ"
                                        value={newGender}
                                        defaultSelectedKeys={[newGender]}
                                        onChange={(e) => setNewGender(e.target.value)}>
                                        <SelectItem key="male" value="male">ຊາຍ</SelectItem>
                                        <SelectItem key="female" value="female">ຍິງ</SelectItem>
                                    </Select>
                                    <Input
                                        type="date"
                                        label="ວັນເດືອນປີເກີດ"
                                        placeholder="ກະລຸນາເລືອກວັນເດືອນປີເກີດ"
                                        value={newBirthday}
                                        onChange={(e) => setNewBirthday(e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className='flex justify-between'>
                                <Button color="danger" variant="light" onPress={() => handleDeleteStudent(selectedStudent.studentId)}>
                                    ລົບລາຍຊື່ນັກຮຽນ
                                </Button>
                                <Button color="primary" onPress={() => handleUpdateStudent(selectedStudent.studentId)}>
                                    ບັນທຶກ
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}

export default EditStudentPage