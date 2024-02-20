import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import {
	Link,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

const App = () => {
	const linkStyle = { padding: '0 20px 0 0 ' };

	return (
		<div>
			<div>
				<Link style={linkStyle} to="/authors">
					authors
				</Link>
				<Link style={linkStyle} to="/books">
					books
				</Link>
				<Link style={linkStyle} to="/add">
					add
				</Link>
			</div>

			<Routes>
				<Route path="/authors" element={<Authors />} />
				<Route path="/books" element={<Books />} />
				<Route path="/add" element={<NewBook />} />
				<Route
					path="/"
					element={<Navigate replace to="/authors" />}
				/>
			</Routes>
		</div>
	);
};

export default App;
