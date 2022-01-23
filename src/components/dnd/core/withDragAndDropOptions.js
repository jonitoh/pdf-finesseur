import React, { useRef, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import ItemTypes from "../../../utils/constants";

export const withDragAndDropOptions = WrappedComponent => {
  const Wrapper = (props) => {
    // create reference
    const ref = useRef(null);

    // drag interaction
    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemTypes.PAGE,
      item: () => {
        const { id, order, url } = props;
        const draggedItem = { id, order, url };
        let items;
        if (props.selectedItems.find(item => item.id === props.id)) {
          items = props.selectedItems;
        } else {
          props.clearItemSelection();
          items = [draggedItem];
        }
        const otherItems = items.concat();
        otherItems.splice(
          items.findIndex(item => item.id === props.id),
          1
        );
        const itemsDragStack = [draggedItem, ...otherItems];
        const itemsIDs = items.map(item => item.id);
        return { items, itemsDragStack, draggedItem, itemsIDs };
      },
      isDragging: monitor => {
        return monitor.getItem().itemsIDs.includes(props.id);
      },
      end: item => {
        props.rearrangeItems(item);
        props.clearItemSelection();
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    });

    // drop interaction
    const [{ hovered }, drop] = useDrop({
      accept: ItemTypes.PAGE,
      // drop: () => ({
      //               boxType: "Picture"
      //   }),
      hover: (item, monitor) => {
        const dragIndex = item.draggedItem.index;
        const hoverIndex = props.index;

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Get horizontal middle
        const midX =
          hoverBoundingRect.left +
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        // Determine mouse position
        const pointerOffset = monitor.getClientOffset();
        const newInsertIndex =
          pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;
        props.setInsertIndex(dragIndex, hoverIndex, newInsertIndex);
      },
      collect: (monitor) => ({
        hovered: monitor.isOver()
      })
    });

    // attach reference
    drag(drop(ref));

    const onClick = (e) => {
      props.onSelectionChange(props.index, e.metaKey, e.shiftKey);
    };

    useEffect(() => {
      // This gets called after every render, by default
      // (the first one, and every one after that)

      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      preview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      });
      // If you want to implement componentWillUnmount,
      // return a function from here, and React will call
      // it prior to unmounting.
      // return () => console.log('unmounting...');
    }, []);

    //const { url } = props;
    const opacity = isDragging ? 0.4 : 1;

    const styleClasses = [];

    // if (isDragging) {
    //   styleClasses.push('card-wrapper-dragging');
    // }
    if (props.isSelected) {
      styleClasses.push("item-wrapper-selected");
    }

    return (
      <div key={"item-div-" + props.id} style={{ position: "relative" }}>
        {props.insertLineOnLeft && hovered && (
          <div className="insert-line-left" />
        )}
        <div className={"item-wrapper " + styleClasses.join(" ")}>
          <div ref={ref} className="item" onClick={onClick} style={{ opacity }}>
          <WrappedComponent {...props} />
          </div>
        </div>
        {props.insertLineOnRight && hovered && (
          <div className="insert-line-right" />
        )}
      </div>
    );
  }
  return Wrapper
};