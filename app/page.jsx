'use client'

import Image from "next/image";
import { Card, CardHeader, CardBody, Select, SelectItem, Input, Button, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow, Pagination, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";
import { useState, useMemo, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [searchMethod, setSearchMethod] = useState("self");
  const [nameEng, setNameEng] = useState("");
  const [gen, setGen] = useState("");
  const [gender, setGender] = useState("");
  const [studentId, setStudentId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const { isOpen: isCheckScore, onOpen: onCheckScore, onOpenChange: onCheckScoreChange } = useDisclosure();
  const [manageStudent, setManageStudent] = useState(null);

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const defaultTerm = ['1', '2', '3', '4', '5', '6'];

  const handleSearch = () => {
    let filtered = [...students];

    if (searchMethod === 'studentId' && studentId) {
      filtered = filtered.filter(student =>
        student.studentId.toLowerCase().includes(studentId.toLowerCase())
      );
    }
    else if (searchMethod === 'self') {
      if (nameEng) {
        filtered = filtered.filter(student =>
          student.nameEng.toLowerCase().includes(nameEng.toLowerCase())
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
    const student = students.find(student => student.studentId === studentId);
    if (student) {
      setManageStudent(student);
      onManageStudent();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Student not found",
      });
    }
  }

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

  const getScoreForTerm = (scores, termNumber, field) => {
    if (!scores || !scores[0] || !scores[0][field]) return "-";
    return scores[0][field][0][`term${termNumber}`] || "-";
  }

  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'F';
    return '-';
  }

  const averageScore = (scores, termNumber) => {
    // Define fields based on term number
    let fields = [];
    if (termNumber <= 3) {
      fields = ['reading', 'speaking', 'grammar', 'tense', 'wordCombination'];
    } else {
      fields = ['reading', 'speaking', 'listening', 'grammar', 'translation'];
    }

    let validScores = 0;
    const totalScore = fields.reduce((sum, field) => {
      const score = getScoreForTerm(scores, termNumber, field);
      if (score !== "-") {
        validScores++;
        return sum + Number(score);
      }
      return sum;
    }, 0);

    return validScores > 0 ? Math.round(totalScore / validScores) : "-";
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
                <Input
                  type="text"
                  label="ຊື່ພາສາອັງກິດ"
                  placeholder="ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ"
                  value={nameEng}
                  onChange={(e) => setNameEng(e.target.value)}
                />
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
                      <TableCell>{student.nameEng}</TableCell>
                      <TableCell>{student.nameLao}</TableCell>
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

            <Modal size='5xl' isOpen={isCheckScore} placement="center" onOpenChange={onCheckScoreChange}>
              <ModalContent className='py-10'>
                <ModalHeader className='text-xl font-bold flex justify-center'>ກວດສອບຄະແນນຂອງ {manageStudent?.nameEng}</ModalHeader>
                <ModalBody className='flex flex-col gap-4'>
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
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'reading')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'speaking')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'grammar')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'wordCombination')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'tense')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'listening')}</TableCell>
                          <TableCell>{getScoreForTerm(manageStudent?.scores, term, 'translation')}</TableCell>
                          <TableCell>{averageScore(manageStudent?.scores, term)}</TableCell>
                          <TableCell>{getGrade(averageScore(manageStudent?.scores, term))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ModalBody>
              </ModalContent>
            </Modal>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
