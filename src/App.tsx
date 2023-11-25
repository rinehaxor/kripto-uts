// App.tsx
import { Table, TableBody, TableCell, TableRow } from "./component/Table";
import HillCipher from "./HillCipher";
import HillCipherDecrypt from "./HillCipherDecrypt";

function App() {
	const abjad: string[] = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
	];
	return (
		<div className="container mx-auto max-w-7xl">
			<Table>
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
			<HillCipher />
			<HillCipherDecrypt />
		</div>
	);
}

export default App;
