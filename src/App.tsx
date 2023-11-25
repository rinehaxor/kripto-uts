// App.tsx
import { Table, TableBody, TableCell, TableRow } from "./component/Table";
import { abjad } from "./constant/abjad";
import HillCipher from "./HillCipher";
import HillCipherDecrypt from "./HillCipherDecrypt";

function App() {
	return (
		<div className="container mx-auto max-w-7xl">
			<h1 className="text-3xl font-bold text-center mt-10">Hill Cipher</h1>
			<Table className="my-10">
				<TableBody>
					<TableRow>
						{abjad.map((item, index) => {
							return <TableCell key={index}>{item}</TableCell>;
						})}
					</TableRow>
					<TableRow>
						{abjad.map((_item, index) => {
							return <TableCell key={index}>{index}</TableCell>;
						})}
					</TableRow>
				</TableBody>
			</Table>
			<div className="w-full flex ">
				<HillCipher />
				<HillCipherDecrypt />
			</div>
		</div>
	);
}

export default App;
