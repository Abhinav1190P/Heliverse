import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchUsers, fetchFilteredUsers, fetchFilteredUsersByText, fetchOneUser } from './redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Flex, VStack, Text, Avatar, Input, Select, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Badge,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Button,
    ModalCloseButton,
} from '@chakra-ui/react';
import { debounce } from 'lodash';
const PAGE_SIZE = 20;

function PaginationPage() {
    const [loading, setLoading] = useState(false);
    const { page } = useParams()
    const users = useSelector((state) => state.users.users);
    const currentUser = useSelector((state) => state.users.currentUser);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);
    const [filters, setFilters] = useState({});

    const dispatch = useDispatch()

    useEffect(() => {
        const currentPage = page || 1
        setLoading(true)
        dispatch(fetchUsers(currentPage))
        setLoading(false)
    }, [page]);


    const nextPage = () => {
        const nextPageNumber = parseInt(page || 1) + 1;
        window.location.href = `/pagination/${nextPageNumber}`;
    };

    const prevPage = () => {
        const prevPageNumber = Math.max(parseInt(page || 1) - 1, 1);
        window.location.href = `/pagination/${prevPageNumber}`;
    };


    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        domain: [],
        gender: [],
        availability: []
    });


    const filterByText = async (value) => {
        dispatch(fetchFilteredUsersByText(value))
    }

    const debouncedHandleSearch = debounce((value) => {
        filterByText(value)
        setSearchQuery(value);
    }, 500);

    const handleSearch = (e) => {
        const { value } = e.target;
        debouncedHandleSearch(value);
    };
    const handleFilterChange = async (type, value) => {
        setLoading(true);
        try {
            const updatedFilters = { ...filters, [type]: value };
            setFilters(updatedFilters);

            dispatch(fetchFilteredUsers(updatedFilters));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    const { isOpen, onOpen, onClose } = useDisclosure()

    const fetchOneUserById = async (id) => {
        dispatch(fetchOneUser(id))
    }
    return (
        <Box w="100vw" h={'100vh'}>
            <Flex alignItems={'center'} justifyContent={'center'} w="100%" h="100%">
                <VStack spacing={4} align="stretch" maxW="900px" w="100%" p={4}>
                    <Flex justify="space-between" mb={4} w="100%">
                        <Input maxW={'400px'} placeholder="Search by name" value={searchQuery} onChange={handleSearch} />
                        <Flex>
                            <Select placeholder="Domain" onChange={(e) => handleFilterChange('domain', e.target.value)} mr={2}>
                                <option value="Sales">Sales</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="IT">IT</option>
                                <option value="Management">Management</option>
                                <option value="UI Designing">UI Designing</option>

                            </Select>

                            <Select placeholder="Gender" onChange={(e) => handleFilterChange('gender', e.target.value)} mr={2}>
                                <option value={'Male'}>Male</option>
                                <option value={'Female'}>Female</option>
                                <option value={'Agender'}>Agender</option>
                                <option value={'Bigender'}>Bigender</option>

                            </Select>
                            <Select placeholder="Availability" onChange={(e) => handleFilterChange('available', e.target.value)}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </Select>
                        </Flex>
                    </Flex>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : error ? (
                        <Text>Error: {error}</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="xl" fontWeight="bold">Users Page {page || 1}</Text>
                            <Flex flexWrap="wrap" justify="space-between">
                                {users.map((user) => (
                                    <Flex onClick={() => { onOpen(); fetchOneUserById(user._id) }} align="center" cursor={'pointer'} justify="flex-start" bg="white" p={4} borderRadius="md" boxShadow="lg" m={2}>
                                        <Avatar src={user.avatar} alt={`${user.first_name} ${user.last_name}`} size="md" mr={4} />
                                        <Box>
                                            <Text fontSize="12px" fontWeight="bold">{user.first_name} {user.last_name}</Text>
                                            <Text fontSize="sm" color="gray.600">Available: {user.available ? 'Yes' : 'No'}</Text>
                                        </Box>
                                    </Flex>
                                ))}
                            </Flex>
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>{ }</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        {
                                            currentUser ? (
                                                <Flex direction="column" alignItems="center">
                                                    <Avatar src={currentUser.avatar} size="xl" mb={4} />
                                                    <Text fontSize="2xl" fontWeight="bold">{currentUser.first_name} {currentUser.last_name}</Text>
                                                    <Text fontSize="lg" color="gray.500" mb={4}>{currentUser.email}</Text>
                                                    <Flex align="center" mb={4}>
                                                        <Badge variant="solid" colorScheme="green" mr={2}>
                                                            {currentUser.gender}
                                                        </Badge>
                                                        <Badge variant="solid" colorScheme="blue">
                                                            {currentUser.domain}
                                                        </Badge>
                                                    </Flex>
                                                    <Text fontSize="lg" mb={4}>
                                                        Availability: {currentUser.available ? 'Available' : 'Not Available'}
                                                    </Text>
                                                </Flex>
                                            ) : (null)
                                        }
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                                            Close
                                        </Button>
                                        <Button variant='ghost'>Secondary Action</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <Flex justify="space-between">
                                <button onClick={prevPage}>Previous</button>
                                <button onClick={nextPage}>Next</button>
                            </Flex>
                        </VStack>
                    )}
                </VStack>
            </Flex>
        </Box>
    );
}

export default PaginationPage;
