import {
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';


export default function withAction() {
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>SigmaValley DAO</Box>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              size={'md'}
              mr={4}
              leftIcon={<AddIcon />}>
              Connect wallet
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}