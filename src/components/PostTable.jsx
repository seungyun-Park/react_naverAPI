import React from 'react';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';

const Table = styled.table`
  border-collapse: collapse;
  width: 80%; 
  margin: 0 auto; 
  border: 2px solid #000000;
`;

const Tr = styled.tr`
  padding: 8px;
  ${({ wide }) => wide && 'width: 10%;'} /* 제목을 제외한 다른 열은 좁게 설정 */
`;

const Td = styled.td`
  border-bottom: 2px solid #000000;
  padding: 8px;
  ${({ wide }) => wide && 'width: 70%;'} /* 제목 열은 넓게 설정 */
`;

const Thead = styled.thead`
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #dfd9ce;
  font-weight: 550;
  font-size: 22px;
  height: 40px;
`;


function PostTable(props){
  const { postwhat, currentPage, postsPerPage } = props;
  const navigate = useNavigate();

  return (
        <Table>
            <Thead>
              <Tr>
                <Td></Td>
                <Td>작성자</Td>
                <Td wide>제목</Td>
                <Td>작성일</Td>
                <Td></Td>
              </Tr>
            </Thead>

              {postwhat && <PostList
                    posts = {postwhat}
                    onClickItem = {(item) => {
                        navigate(`/post/${item.postid}`);
                    }}
                />
              }
        </Table>
  );
};

export default PostTable;