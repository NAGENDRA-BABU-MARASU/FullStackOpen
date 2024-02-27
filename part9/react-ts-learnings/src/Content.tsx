import { CoursePart } from "./App";
import Part from "./Part";


interface ContentProps { 
  courseParts: CoursePart[]
}

const Content = (props: ContentProps) => {
	return props.courseParts.map(course => <Part part={course} />)
};

export default Content;
