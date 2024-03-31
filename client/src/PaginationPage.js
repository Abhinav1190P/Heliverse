import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchUsers } from './redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, VStack, Text, Avatar } from '@chakra-ui/react';
const PAGE_SIZE = 20;

function PaginationPage() {
    const [loading, setLoading] = useState(false);
    const { page } = useParams()
    const users = useSelector((state) => state.users.users);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);

    const dispatch = useDispatch()
    console.log(users)
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
        // Redirect to previous page
        window.location.href = `/pagination/${prevPageNumber}`;
    };

    return (
        <Box w="100vw" h={'100vh'}>
            <Flex alignItems={'center'} justifyContent={'center'} w="100%" h="100%">
                <VStack spacing={4} align="stretch" maxW="900px" w="100%" p={4}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : error ? (
                        <Text>Error: {error}</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="xl" fontWeight="bold">Users Page {page || 1}</Text>
                            <Flex flexWrap="wrap" justify="space-between">
                                {users.map((user) => (
                                    <Flex align="center" cursor={'pointer'} justify="flex-start" bg="white" p={4} borderRadius="md" boxShadow="lg" m={2}>
                                        <Avatar src={user.avatar} alt={`${user.first_name} ${user.last_name}`} size="md" mr={4} />
                                        <Box>
                                            <Text fontSize="12px" fontWeight="bold">{user.first_name} {user.last_name}</Text>
                                            <Text fontSize="sm" color="gray.600">Available: {user.available ? 'Yes' : 'No'}</Text>

                                        </Box>
                                    </Flex>
                                ))}
                            </Flex>
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
