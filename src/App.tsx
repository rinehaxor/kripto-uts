// App.tsx
import { Table, TableBody, TableCell, TableRow } from "./component/Table";
import { abjad } from "./constant/abjad";
import HillCipher from "./HillCipher";
import HillCipherDecrypt from "./HillCipherDecrypt";

function App() {
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
