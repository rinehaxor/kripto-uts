// App.tsx
import { Table, TableBody, TableCell, TableRow } from "./component/Table";
import { abjad } from "./constant/abjad";
import { key } from "./constant/key";
import HillCipher from "./HillCipher";
import HillCipherDecryptor from "./HillCipherDecrypt";

function App() {
	return (
		<div className="container mx-auto max-w-7xl">
			<h1 className="text-3xl font-bold text-center mt-10">Hill Cipher</h1>
			<Table className="my-10">
				<TableBody className="border">
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
			<div className="w-full flex items-start">
				<div className="flex flex-col w-1/3">
					<h1 className="uppercase font-bold mb-3">Kunci :</h1>
					{key.map((row, rowIndex) => (
						<div key={rowIndex} className="flex">
							{row.map((cell, cellIndex) => (
								<div
									key={cellIndex}
									className="p-3 w-10 flex items-center justify-center border border-gray-400">
									{cell}
								</div>
							))}
						</div>
					))}
				</div>
				<HillCipher />
				<HillCipherDecryptor />
			</div>
		</div>
	);
}

export default App;
