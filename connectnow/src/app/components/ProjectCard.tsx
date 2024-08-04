import React from 'react';
import { Card } from "flowbite-react";

type Props = {
  projectId: number;
  img: string;
  name: string;
  description: string;
}

const ProjectCard = (props: Props) => {
  const limit = 55;
  return (
    <div id={props.projectId.toString()} onClick={(event: React.MouseEvent<HTMLDivElement>)=>{window.location.href=`http://localhost:3000/projectMain/${props.projectId}`;}}>
      <Card
        className="max-w-sm cursor-pointer"
        imgAlt="Meaningful alt text for an image that is not purely decorative"
        imgSrc={props.img}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {props.name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 break-words">
          {props.description.length>limit? `${props.description.slice(0, limit)} ...`: props.description}
        </p>
      </Card>
    </div>
  )
}

export default ProjectCard;