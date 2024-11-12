'use client'

import React, { useState, useEffect } from 'react'
import AdminNavbar from '../../../components/AdminNavbar'
import { Input, Card, CardBody, CardHeader, Button, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Pagination } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

function StudentScorePage() {
  const router = useRouter();
  const [searchMethod, setSearchMethod] = useState('self');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState('');
  const [gen, setGen] = useState('')
  const [nameEng, setNameEng] = useState('')
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { isOpen: isManageStudent, onOpen: onManageStudent, onOpenChange: onManageStudentChange } = useDisclosure();
  const { isOpen: isCheckScore, onOpen: onCheckScore, onOpenChange: onCheckScoreChange } = useDisclosure();
  const [manageStudent, setManageStudent] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // post score
  const [term, setTerm] = useState('');
  const [reading, setReading] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [listening, setListening] = useState('');
  const [grammar, setGrammar] = useState('');
  const [tense, setTense] = useState('');
  const [wordComb, setWordComb] = useState('');
  const [translation, setTranslation] = useState('');


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

  const handlePostScore = async (studentId) => {
    if (!studentId || !term) {
      console.error('Student ID and term are required');
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Student ID and term are required",
      });
      return;
    }

    try {
      const res = await fetch(`/api/student/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          term,
          reading: Number(reading) || 0,
          speaking: Number(speaking) || 0,
          listening: Number(listening) || 0,
          grammar: Number(grammar) || 0,
          tense: Number(tense) || 0,
          wordComb: Number(wordComb) || 0,
          translation: Number(translation) || 0
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update score');
      }

      await fetchStudents();
      setTerm('');
      setReading('');
      setSpeaking('');
      setListening('');
      setGrammar('');
      setTense('');
      setWordComb('');
      setTranslation('');
      onManageStudentChange(false); // Close modal after success
      Swal.fire({
        icon: "success",
        title: "ສຳເລັດ",
        text: "ຂໍ້ມູນນັກຮຽນຖືກບັນທຶກແລ້ວ",
      });
    } catch (error) {
      console.error('Error posting score:', error);
      Swal.fire({
        icon: "error",
        title: "ບໍ່ສຳເລັດ",
        text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນນັກຮຽນ",
      });
    }
  }

  const defaultTerm = [1, 2, 3, 4, 5, 6];

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

  const pages = Math.ceil(filteredStudents.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudents.slice(start, end);
  }, [page, filteredStudents]);

  // calculate average score for each term
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
    <div>
      <AdminNavbar />
      <div className='max-w-screen-xl mx-auto mt-10 p-5'>
        <Card>
          <CardHeader className='flex justify-center'>
            <h1 className='text-2xl font-bold'>ຄະແນນນັກຮຽນ</h1>
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
                <TableColumn>ຊື່ພາສາລາວ</TableColumn>
                <TableColumn>ເພດ</TableColumn>
                <TableColumn>ລຸ່ນ</TableColumn>
                <TableColumn>ວັນເດືອນປີເກີດ</TableColumn>
                <TableColumn>ຈັດການ</TableColumn>
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
                        <Button onClick={() => handleManageStudent(student.studentId)} size="sm" color="primary">
                          ຈັດການ
                        </Button>
                      </TableCell>
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
            <Modal size='2xl' isOpen={isManageStudent} placement='center' onOpenChange={onManageStudentChange}>
              <ModalContent className='py-10'>
                <ModalHeader className='text-xl font-bold flex justify-center'>ຈັດການຄະແນນຂອງ {manageStudent?.nameEng}</ModalHeader>
                <ModalBody className='flex flex-col gap-4'>
                  <Select
                    label="ເທິມ"
                    placeholder="ກະລຸນາເລືອກເທິມ"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    isRequired
                  >
                    <SelectItem key="1" value="1">ເທິມ 1</SelectItem>
                    <SelectItem key="2" value="2">ເທິມ 2</SelectItem>
                    <SelectItem key="3" value="3">ເທິມ 3</SelectItem>
                    <SelectItem key="4" value="4">ເທິມ 4</SelectItem>
                    <SelectItem key="5" value="5">ເທິມ 5</SelectItem>
                    <SelectItem key="6" value="6">ເທິມ 6</SelectItem>
                  </Select>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Listening' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={listening} onChange={(e) => setListening(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Tense' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={tense} onChange={(e) => setTense(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Word Combin' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={wordComb} onChange={(e) => setWordComb(e.target.value)} />
                    <Input type='number' min="0" max="100" label='Translation' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={translation} onChange={(e) => setTranslation(e.target.value)} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' onClick={() => handlePostScore(manageStudent?.studentId)}>
                    ບັນທຶກຄະແນນ
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
    </div>
  )
}

export default StudentScorePage