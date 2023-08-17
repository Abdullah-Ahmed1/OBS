import dynamic from "next/dynamic";
import { Heading,Button} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { DragDropContext } from "react-beautiful-dnd";
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';

const Column = dynamic(() => import("../components/column"), { ssr: false });

const reorderTasks = (tasks, startIndex, endIndex) => {
  const newTaskList = Array.from(tasks);
  const [removed] = newTaskList.splice(startIndex, 1);
  newTaskList.splice(endIndex, 0, removed);
  return newTaskList;
};

export default function NotesHome(props) {
    const notes = useSelector((state) => state.notes.tasks);
    const dispatch = useDispatch();
    const router = useRouter()
    console.log("*-*-*-*-*-*",router.query,notes)
  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const [state, setState] = useState(initialData);
  const [placeholderProps, setPlaceholderProps] = useState({});

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  useEffect(()=>{
    if(!isEmpty(router.query)){
        const data = {
            tasks:  [...(state.tasks),router.query]
        }
        console.log(state)
        setState(data)
    }
  },[])

  const handleADD = (data)=>{
    setState([...state,data])
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // if the user drops outside of a droppable destination
    if (!destination) return;

    // If the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops in a different postion
    const { tasks } = state;
    const newTasks = reorderTasks(tasks, source.index, destination.index);

    const newState = {
      ...state,
      tasks: newTasks,
    };
    setState(newState);
  };

  const onDragUpdate = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM.parentNode) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = destination.index;
    const sourceIndex = source.index;

    const childrenArray = draggedDOM.parentNode.children
      ? [...draggedDOM.parentNode.children]
      : [];

    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.splice(0, destinationIndex),
      movedItem,
      ...childrenArray.splice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.splice(0, destinationIndex).reduce((total, current) => {
        const style = current.currentStyle || window.getComputedStyle(current);
        const marginBottom = parseFloat(style.marginBottom);
        return total + current.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  const onDragStart = (result) => {
    const { source, draggableId } = result;
    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = source.index;

    if (!draggedDOM.parentNode) return;

    /**
     * 1. Take all the items in the list as an array
     * 2. Slice from the start to the where we are dropping the dragged item (i.e destinationIndex)
     * 3. Reduce and fetch the styles of each item
     * 4. Add up the margins, widths, paddings
     * 5. Accumulate and assign that to clientY
     */
    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, current) => {
          const style =
            current.currentStyle || window.getComputedStyle(current);
          const marginBottom = parseFloat(style.marginBottom);

          return total + current.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <div
        flexdir="column"
        bg="main-bg"
        minh    ="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >
        <div py="4rem" flexdir="column" align="center">
        <Button mt={4}  onClick={()=>router.push('/add')}  colorScheme='teal' type='submit'>
        Add Note
      </Button>
        <Heading fontSize="3xl" fontWeight={600}>
            Notes
          </Heading>
          
        </div>

        <div justify="center" px="4rem">
          <Column placeholderProps={placeholderProps} tasks={notes} />
        </div>
      </div>
    </DragDropContext>
  );
}

const initialData = {
  tasks: [
    { id: Date.now(), content: "The first task" },
  ],
};