'use client'

import Image from "next/image";
import { Card, CardHeader, CardBody, Select, SelectItem, Input, Button, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow, Pagination, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Tabs, Tab } from "@nextui-org/react";
import { useState, useMemo, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [searchMethod, setSearchMethod] = useState("self");
  const [firstNameEng, setFirstNameEng] = useState("");
  const [lastNameEng, setLastNameEng] = useState("");
  const [firstNameLao, setFirstNameLao] = useState("");
  const [lastNameLao, setLastNameLao] = useState("");
  const [gen, setGen] = useState("");
  const [gender, setGender] = useState("");
  const [studentId, setStudentId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const { isOpen: isCheckScore, onOpen: onCheckScore, onOpenChange: onCheckScoreChange } = useDisclosure();
  const [manageStudent, setManageStudent] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลนักเรียน
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch students",
      });
    }
  }

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน fetchStudents เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    fetchStudents();
  }, []);

  const defaultTerm = ['1', '2', '3', '4', '5', '6'];

  // ฟังก์ชันสำหรับค้นหานักเรียน
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

  // ฟังก์ชันสำหรับตรวจสอบคะแนนของนักเรียน
  const handleCheckScore = (studentId) => {
    const student = students.find(student => student.studentId === studentId);
    if (student) {
      setManageStudent(student);
      onCheckScore();
      console.log(student.scores);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Student not found",
      });
    }
  }

  const pages = Math.ceil(filteredStudents.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudents.slice(start, end);
  }, [page, filteredStudents]);

  // ฟังก์ชันสำหรับคำนวณคะแนนเฉลี่ย
  const averageScore = (studentId, term) => {
    const student = students.find(student => student.studentId === studentId)
    if (term == 1) {
      return Math.round((student?.scores[0].term1.reading + student?.scores[0].term1.speaking + student?.scores[0].term1.grammar + student?.scores[0].term1.wordCombination) / 4)
    }
    if (term == 2) {
      return Math.round((student?.scores[0].term2.reading + student?.scores[0].term2.speaking + student?.scores[0].term2.grammar + student?.scores[0].term2.tense) / 4)
    }
    if (term == 3) {
      return Math.round((student?.scores[0].term3.reading + student?.scores[0].term3.speaking + student?.scores[0].term3.grammar + student?.scores[0].term3.tense) / 4)
    }
    if (term == 4) {
      return Math.round((student?.scores[0].term4.reading + student?.scores[0].term4.speaking + student?.scores[0].term4.grammar + student?.scores[0].term4.listening + student?.scores[0].term4.translation) / 5)
    }
    if (term == 5) {
      return Math.round((student?.scores[0].term5.reading + student?.scores[0].term5.speaking + student?.scores[0].term5.grammar + student?.scores[0].term5.listening + student?.scores[0].term5.translation) / 5)
    }
    if (term == 6) {
      return Math.round((student?.scores[0].term6.reading + student?.scores[0].term6.speaking + student?.scores[0].term6.grammar + student?.scores[0].term6.listening + student?.scores[0].term6.translation) / 5)
    }
  }

  // ฟังก์ชันสำหรับกำหนดเกรด
  const getGrade = (studentId, term) => {
    let score = averageScore(studentId, term);
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    if (score > 0) return 'F';
    return '-'
  }

  // ฟังก์ชันสำหรับคำนวณคะแนนสุดท้าย
  const finallScore = (studentId) => {
    const grade1 = getGrade(studentId, 1)
    const grade2 = getGrade(studentId, 2)
    const grade3 = getGrade(studentId, 3)
    const grade4 = getGrade(studentId, 4)
    const grade5 = getGrade(studentId, 5)
    const grade6 = getGrade(studentId, 6)

    if (grade1 !== '-' && grade2 !== '-' && grade3 !== '-' && grade4 !== '-' && grade5 !== '-' && grade6 !== '-') {
      let sum = 0
      for (let i = 1; i <= 6; i++) {
        console.log(i)
        sum += averageScore(studentId, i)
      }
      return Math.round(sum / 6)
    }
  }

  // ฟังก์ชันสำหรับกำหนดเกรดสุดท้าย
  const finallGrade = (studentId) => {
    let score = finallScore(studentId);
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    if (score > 0) return 'F';
    return '-'
  }

  return (
    <>
      <div className='max-w-screen-lg mx-auto mt-10 p-5'>
        <Card>
          <CardHeader className="flex justify-center">
            <h1 className='text-2xl font-bold'>ຫນ້າຫລັກ</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Select
              label="ວິທີການຄົ້ນຫາ"
              placeholder="ກະລຸນາເລືອກວິທີການຄົ້ນຫາ"
              value={searchMethod}
              defaultSelectedKeys={["self"]}
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
            <div className="flex justify-end">
              <Button color="primary" onClick={handleSearch}>
                ຄົ້ນຫາຂໍ້ມູນນັກຮຽນ
              </Button>
            </div>
            <Table aria-label="Student table">
              <TableHeader>
                <TableColumn>ລະຫັດນັກຮຽນ</TableColumn>
                <TableColumn>ຊື່ພາສາອັງກິດ</TableColumn>
                <TableColumn>ຊື່ພາສາລາວ</TableColumn>
                <TableColumn>ເພດ</TableColumn>
                <TableColumn>ລຸ່ນ</TableColumn>
                <TableColumn>ວັນເດືອນປີເກີດ</TableColumn>
                <TableColumn>ກວດສອບຄະແນນ</TableColumn>
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
                  </TableRow>
                ) : (
                  items.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.firstNameEng}</TableCell>
                      <TableCell>{student.firstNameLao}</TableCell>
                      <TableCell>{student.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}</TableCell>
                      <TableCell>{student.gen}</TableCell>
                      <TableCell>{new Date(student.birthday).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleCheckScore(student.studentId)} size="sm" color="primary">
                          ກວດສອບຄະແນນ
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

            <Modal size='5xl' isOpen={isCheckScore} placement="center" onOpenChange={onCheckScoreChange} scrollBehavior="inside">
              <ModalContent className='py-10'>
                <ModalHeader className='text-xl font-bold flex justify-center'>ກວດສອບຄະແນນຂອງ {manageStudent?.firstNameEng} {manageStudent?.lastNameEng}</ModalHeader>
                <ModalBody className='flex flex-col gap-4'>
                  <Tabs aria-label='Options' className="mx-auto">
                    <Tab key="ແຕ່ລະເທີມ" title="ແຕ່ລະເທີມ">
                      <div className='grid md:grid-cols-2 gap-4'>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 1</h3>
                          <Table aria-label='Semester 1'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Start Reading 2</TableCell>
                                <TableCell>{manageStudent?.scores[0].term1.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Elementary I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term1.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Words Combination</TableCell>
                                <TableCell>{manageStudent?.scores[0].term1.wordCombination}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>General Speaking 1</TableCell>
                                <TableCell>{manageStudent?.scores[0].term1.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 1)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 1)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 2</h3>
                          <Table aria-label='Semester 2'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Start Reading 3</TableCell>
                                <TableCell>{manageStudent?.scores[0].term2.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Elementary II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term2.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>12 Tense Part I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term2.tense}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Conversation I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term2.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 2)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 3</h3>
                          <Table aria-label='Semester 3'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Start Reading 4</TableCell>
                                <TableCell>{manageStudent?.scores[0].term3.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Elementary III</TableCell>
                                <TableCell>{manageStudent?.scores[0].term3.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>12 Tense Part II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term3.tense}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Conversation II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term3.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 3)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 3)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 4</h3>
                          <Table aria-label='Semester 4'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Start Reading 5</TableCell>
                                <TableCell>{manageStudent?.scores[0].term4.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Intermediate I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term4.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>News Translation</TableCell>
                                <TableCell>{manageStudent?.scores[0].term4.translation}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Oral Speaking I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term4.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Basic Listening</TableCell>
                                <TableCell>{manageStudent?.scores[0].term4.listening}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 4)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 4)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 5</h3>
                          <Table aria-label='Semester 5'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Start Reading 6</TableCell>
                                <TableCell>{manageStudent?.scores[0].term5.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Intermediate II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term5.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Essay Translation I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term5.translation}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Oral Speaking II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term5.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Listening For TOEIC I</TableCell>
                                <TableCell>{manageStudent?.scores[0].term5.listening}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 5)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 5)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h3 className='font-bold text-center mb-2'>Semester 6</h3>
                          <Table aria-label='Semester 6'>
                            <TableHeader>
                              <TableColumn>Subjects</TableColumn>
                              <TableColumn>Scale 100</TableColumn>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Reading TOEIC Preparation</TableCell>
                                <TableCell>{manageStudent?.scores[0].term6.reading}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grammar for Intermediate III</TableCell>
                                <TableCell>{manageStudent?.scores[0].term6.grammar}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Essay Translation II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term6.translation}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Presentation</TableCell>
                                <TableCell>{manageStudent?.scores[0].term6.speaking}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Listening For TOEIC II</TableCell>
                                <TableCell>{manageStudent?.scores[0].term6.listening}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Average Piont</TableCell>
                                <TableCell>{averageScore(manageStudent?.studentId, 6)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Grade</TableCell>
                                <TableCell>{getGrade(manageStudent?.studentId, 6)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </Tab>
                    <Tab key="ລວມ" title="ລວມ">
                      <Table aria-label='Score table'>
                        <TableHeader>
                          <TableColumn>ເທິມ</TableColumn>
                          <TableColumn>Reading</TableColumn>
                          <TableColumn>Speaking</TableColumn>
                          <TableColumn>Grammar</TableColumn>
                          <TableColumn>Word Combin</TableColumn>
                          <TableColumn>Tense</TableColumn>
                          <TableColumn>Listening</TableColumn>
                          <TableColumn>Translation</TableColumn>
                          <TableColumn>Average Score</TableColumn>
                          <TableColumn>Grade</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {defaultTerm.map((term) => (
                            <TableRow key={term}>
                              <TableCell>{term}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].reading || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].speaking || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].grammar || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].wordCombination || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].tense || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].listening || '-'}</TableCell>
                              <TableCell>{manageStudent?.scores[0][`term${term}`].translation || '-'}</TableCell>
                              <TableCell>{averageScore(manageStudent?.studentId, term) || '-'}</TableCell>
                              <TableCell>{getGrade(manageStudent?.studentId, term) || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className='mt-4'>
                        <p>ຄະແນນສະເລ່ຍ : {finallScore(manageStudent?.studentId) || '-'}</p>
                        <p>ເກຣດ : {finallGrade(manageStudent?.studentId)}</p>
                      </div>
                    </Tab>
                  </Tabs>
                </ModalBody>
              </ModalContent>
            </Modal>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
