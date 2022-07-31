import React from "react";
import { Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";

export const CustomPagination = ({
  rowsPerPage,
  totalRows,
  paginate,
  paginatePrev,
  paginateNext,
  paginateFirst,
  paginateLast,
  currentPage,
}) => {
  
  const [pageArray, setPageArray] = useState([])
  const [setIndex, setSetIndex] = useState(0)
  const [pageNumbers,setPageNumbers] = useState([]);
//   let pageArray = [];
  let setArray = [];

  const updatePageNumbers = () => {
    for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
      setPageNumbers(oldValue => [...oldValue,i])
    }

    let start = 1;
    let end = 5;
    //   [1,2,3,4,5,6,7,8,9,10] 2 [1,2,3,4,5] [6,7,8,9,10]
    for (let i = 1; i <= Math.ceil(pageNumbers.length / 5); i++) {
        setArray = [];
      for (let j = start; j <= end; j++) {
        setArray.push(j);
      }
    //   setPageArray(oldValue => {[...oldValue,"neha"]})
      setPageArray(oldArray => [...oldArray, setArray]);
      console.log("end");
      start = start + 5;
      end = end + 5;
    }
  };

  useEffect(() => {
   
        updatePageNumbers();

  },[totalRows]);

  useEffect(() => {
      console.log("pageNumbers useEffect",pageNumbers)
      console.log(pageNumbers.length)
  },[pageNumbers]);


  return (
    <Pagination>
      <Pagination.First onClick={paginateFirst} />
      <Pagination.Prev onClick={paginatePrev} />
      {/* <Pagination.Ellipsis />   */}
       {pageNumbers.length > 0 &&
         pageNumbers.slice(currentPage-1,currentPage+4).map((item, i) => {
            console.log(pageArray)
            return (
              <Pagination.Item
                key={i}
                active={currentPage === item ? true : false}
                onClick={() => paginate(item)}
              >
                {item}
              </Pagination.Item>
            );
          })
       }
      <Pagination.Next onClick={paginateNext} />
      <Pagination.Last onClick={() => paginateLast(pageNumbers.length)}/>
    </Pagination>
  );
};
