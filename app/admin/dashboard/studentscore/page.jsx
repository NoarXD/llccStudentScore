'use client'

import React, { useState, useEffect } from 'react'
import AdminNavbar from '../../../components/AdminNavbar'
import { Input, Card, CardBody, CardHeader, Button, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Pagination, Tabs, Tab } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

function StudentScorePage() {
  const router = useRouter();
  const [searchMethod, setSearchMethod] = useState('self');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState('');
  const [gen, setGen] = useState('')
  const [firstNameEng, setFirstNameEng] = useState('')
  const [lastNameEng, setLastNameEng] = useState('')
  const [firstNameLao, setFirstNameLao] = useState('')
  const [lastNameLao, setLastNameLao] = useState('')
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { isOpen: isManageStudent, onOpen: onManageStudent, onOpenChange: onManageStudentChange } = useDisclosure();
  const { isOpen: isCheckScore, onOpen: onCheckScore, onOpenChange: onCheckScoreChange } = useDisclosure();
  const [manageStudent, setManageStudent] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // post score
  const [term, setTerm] = useState();
  const [reading, setReading] = useState();
  const [speaking, setSpeaking] = useState();
  const [listening, setListening] = useState();
  const [grammar, setGrammar] = useState();
  const [tense, setTense] = useState();
  const [wordComb, setWordComb] = useState();
  const [translation, setTranslation] = useState();


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
    const student = students.find(student => student.studentId === studentId);
    if (student) {
      setManageStudent(student);
      setTerm()
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

    let postData;
    if (term == 1) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        wordCombination: Number(wordComb) || 0,
      };
    } else if (term == 2) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        tense: Number(tense) || 0,
      };
    } else if (term == 3) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        tense: Number(tense) || 0,
      };
    } else if (term == 4) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        listening: Number(listening) || 0,
        translation: Number(translation) || 0,
      };
    } else if (term == 5) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        listening: Number(listening) || 0,
        translation: Number(translation) || 0,
      };
    } else if (term == 6) {
      postData = {
        studentId,
        term,
        reading: Number(reading) || 0,
        speaking: Number(speaking) || 0,
        grammar: Number(grammar) || 0,
        listening: Number(listening) || 0,
        translation: Number(translation) || 0,
      };
    }

    try {
      const res = await fetch(`/api/student/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          postData
        ),
      });

      if (!res.ok) {
        throw new Error('Failed to update score');
      }

      await fetchStudents();
      postData = {}
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

  const pages = Math.ceil(filteredStudents.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudents.slice(start, end);
  }, [page, filteredStudents]);

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
        sum += averageScore(studentId, i)
      }
      return Math.round(sum / 6)
    }
  }

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

  const pullScore = (e, studentId) => {
    const student = students.find(student => student.studentId === studentId);
    setTerm(e.target.value)
    switch (e.target.value) {
      case '1':
        setReading(student?.scores[0].term1.reading == 0 ? '' : student?.scores[0].term1.reading)
        setSpeaking(student?.scores[0].term1.speaking == 0 ? '' : student?.scores[0].term1.speaking)
        setGrammar(student?.scores[0].term1.grammar == 0 ? '' : student?.scores[0].term1.grammar)
        setWordComb(student?.scores[0].term1.wordCombination == 0 ? '' : student?.scores[0].term1.wordCombination)
        break;
      case '2':
        setReading(student?.scores[0].term2.reading == 0 ? '' : student?.scores[0].term2.reading)
        setSpeaking(student?.scores[0].term2.speaking == 0 ? '' : student?.scores[0].term2.speaking)
        setGrammar(student?.scores[0].term2.grammar == 0 ? '' : student?.scores[0].term2.grammar)
        setTense(student?.scores[0].term2.tense == 0 ? '' : student?.scores[0].term2.tense)
        break;
      case '3':
        setReading(student?.scores[0].term3.reading == 0 ? '' : student?.scores[0].term3.reading)
        setSpeaking(student?.scores[0].term3.speaking == 0 ? '' : student?.scores[0].term3.speaking)
        setGrammar(student?.scores[0].term3.grammar == 0 ? '' : student?.scores[0].term3.grammar)
        setTense(student?.scores[0].term3.tense == 0 ? '' : student?.scores[0].term3.tense)
        break;
      case '4':
        setReading(student?.scores[0].term4.reading == 0 ? '' : student?.scores[0].term4.reading)
        setSpeaking(student?.scores[0].term4.speaking == 0 ? '' : student?.scores[0].term4.speaking)
        setGrammar(student?.scores[0].term4.grammar == 0 ? '' : student?.scores[0].term4.grammar)
        setListening(student?.scores[0].term4.listening == 0 ? '' : student?.scores[0].term4.listening)
        setTranslation(student?.scores[0].term4.translation == 0 ? '' : student?.scores[0].term4.translation)
        break;
      case '5':
        setReading(student?.scores[0].term5.reading == 0 ? '' : student?.scores[0].term5.reading)
        setSpeaking(student?.scores[0].term5.speaking == 0 ? '' : student?.scores[0].term5.speaking)
        setGrammar(student?.scores[0].term5.grammar == 0 ? '' : student?.scores[0].term5.grammar)
        setListening(student?.scores[0].term5.listening == 0 ? '' : student?.scores[0].term5.listening)
        setTranslation(student?.scores[0].term5.translation == 0 ? '' : student?.scores[0].term5.translation)
        break;
      case '6':
        setReading(student?.scores[0].term6.reading == 0 ? '' : student?.scores[0].term6.reading)
        setSpeaking(student?.scores[0].term6.speaking == 0 ? '' : student?.scores[0].term6.speaking)
        setGrammar(student?.scores[0].term6.grammar == 0 ? '' : student?.scores[0].term6.grammar)
        setListening(student?.scores[0].term6.listening == 0 ? '' : student?.scores[0].term6.listening)
        setTranslation(student?.scores[0].term6.translation == 0 ? '' : student?.scores[0].term6.translation)
        break;
    }
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
                      <TableCell>{student.firstNameEng}</TableCell>
                      <TableCell>{student.firstNameLao}</TableCell>
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
                <ModalHeader className='text-xl font-bold flex justify-center'>ຈັດການຄະແນນຂອງ {manageStudent?.firstNameEng} {manageStudent?.lastNameEng}</ModalHeader>
                <ModalBody className='flex flex-col gap-4'>
                  <Select
                    label="ເທິມ"
                    placeholder="ກະລຸນາເລືອກເທິມ"
                    value={term}
                    onChange={(e) => pullScore(e, manageStudent?.studentId)}
                    isRequired
                  >
                    <SelectItem key="1" value="1">ເທິມ 1</SelectItem>
                    <SelectItem key="2" value="2">ເທິມ 2</SelectItem>
                    <SelectItem key="3" value="3">ເທິມ 3</SelectItem>
                    <SelectItem key="4" value="4">ເທິມ 4</SelectItem>
                    <SelectItem key="5" value="5">ເທິມ 5</SelectItem>
                    <SelectItem key="6" value="6">ເທິມ 6</SelectItem>
                  </Select>
                  {term == 1 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Word Combin' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={wordComb} onChange={(e) => setWordComb(e.target.value)} />
                    </div>
                  )}
                  {term == 2 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Tense' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={tense} onChange={(e) => setTense(e.target.value)} />
                    </div>
                  )}
                  {term == 3 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Tense' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={tense} onChange={(e) => setTense(e.target.value)} />
                    </div>
                  )}
                  {term == 4 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Listening' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={listening} onChange={(e) => setListening(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Translation' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={translation} onChange={(e) => setTranslation(e.target.value)} />
                    </div>
                  )}
                  {term == 5 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Listening' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={listening} onChange={(e) => setListening(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Translation' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={translation} onChange={(e) => setTranslation(e.target.value)} />
                    </div>
                  )}
                  {term == 6 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Input type='number' min="0" max="100" label='Reading' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={reading} onChange={(e) => setReading(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Speaking' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Grammar' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={grammar} onChange={(e) => setGrammar(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Listening' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={listening} onChange={(e) => setListening(e.target.value)} />
                      <Input type='number' min="0" max="100" label='Translation' placeholder='ກະລຸນາປ້ອນຄະແນນ' value={translation} onChange={(e) => setTranslation(e.target.value)} />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' onClick={() => handlePostScore(manageStudent?.studentId)}>
                    ບັນທຶກຄະແນນ
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal size='5xl' isOpen={isCheckScore} placement="center" onOpenChange={onCheckScoreChange} scrollBehavior='inside'>
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
    </div>
  )
}

export default StudentScorePage