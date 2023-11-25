import { create, all } from "mathjs";
import { useState } from "react";

const HillCipherDecrypt = () => {
	const [plaintext, setPlaintext] = useState<string>("");
	const [decryptText, setdecryptText] = useState<string>("");
	const math = create(all);
	const getCofactor = (mat, p, q) => {
		const size = mat.length;
		const temp = [];

		for (let row = 0; row < size; row++) {
			const currentRow = [];
			for (let col = 0; col < size; col++) {
				if (row !== p && col !== q) {
					currentRow.push(mat[row][col]);
				}
			}
			if (currentRow.length > 0) {
				temp.push(currentRow);
			}
		}

		const cofactor = math.det(temp);
		return ((p + q) % 2 === 0 ? 1 : -1) * cofactor;
	};

	const getCofactorMatrix = (mat) => {
		const size = mat.length;
		const cofactorMat = [];

		for (let row = 0; row < size; row++) {
			const currentRow = [];
			for (let col = 0; col < size; col++) {
				const cofactor = getCofactor(mat, row, col);
				currentRow.push(cofactor);
			}
			cofactorMat.push(currentRow);
		}

		return cofactorMat;
	};
	const getAdjugateMatrix = (mat) => {
		const cofactorMat = getCofactorMatrix(mat);
		const adjugateMat = math.transpose(cofactorMat);
		return adjugateMat;
	};

	const adjugateMatrix = getAdjugateMatrix([
		[2, 8, 15],
		[7, 4, 17],
		[8, 13, 6],
	]);

	const x = 5;
	const productMatrix = adjugateMatrix.map((row) =>
		row.map((element) => math.mod(math.multiply(element, x), 26))
	);

	// Fungsi untuk mengalikan matriks kunci dengan vektor teks
	//memiliki 2 param key dan messageVector yang digunakan untuk menambil array 1 diemensi lalu dikalikan dengan key
	//key menggunakan array 2 dimensi sebagai contoh [[1, 2], [3, 4],[5,6]] array didalam array
	//resilt adalah vektor  setiap elemennya adalah jumlah modulo 26
	const multiplyMatrixWithVector = (
		key: number[][],
		messageVector: number[]
	): number[] => {
		const result: number[] = new Array(messageVector.length).fill(0);

		for (let i = 0; i < messageVector.length; i++) {
			for (let j = 0; j < messageVector.length; j++) {
				result[i] += key[i][j] * messageVector[j];
			}
			result[i] %= 26;
		}

		return result;
	};

	// menerima 1 parameter teks yang dirubah menjadi array 1 dimensi dan menjadi huruf besar semua dengan toUppercahse
	//split untuk memecah isi dari input contoh ABCD menjadi [A,B,C,D]
	//  lalu di maping ap((char) => char.charCodeAt(0) - 'A'.charCodeAt(0)):  fungsi tersebut. Untuk setiap karakter dalam array
	//'A'.charCodeAt(0): Mengonversi  'A' menjadi kode ASCII-nya, nilai default 65.
	//char.charCodeAt(0) - 'A'.charCodeAt(0): Dengan mengurangi nilai ASCII dari 'A' dari setiap karakter, kita mengubah alfabet menjadi range 0-25 (dimana 'A' = 0, 'B' = 1, dst.).
	const stringToVector = (text: string): number[] => {
		return text
			.toUpperCase()
			.split("")
			.map((char) => char.charCodeAt(0) - "A".charCodeAt(0));
	};

	//menerima satu parameter vec dengan format angka number array[]
	//lalu maping array yang diambil dari nilai i
	//String.fromCharCode(i + 'A'.charCodeAt(0)):  ini mengonversi setiap angka dalam array kembali menjadi karakter.
	//i + 'A'.charCodeAt(0): Karena dalam proses enkripsi setiap huruf diubah menjadi angka 0-25,   menambahkan ini dengan 65 untuk mendapatkan kembali kode Ascci menggunakan String.fromCharCode(
	const vectorToString = (vec: number[]): string => {
		return vec.map((i) => String.fromCharCode(i + "A".charCodeAt(0))).join("");
	};

	// variabel key yang berisi array 2 dimensi yaitu matriks yang diberikan dibawah ini adalah 3x3
	const decrypt = () => {
		const plaintextVector = stringToVector(plaintext); // mengonversi string plaintext menjadi vektor numerik. Setiap huruf diubah menjadi nilai numeriknya sesuai posisi dalam alfabet (A=0, B=1, ..., Z=25
		const decryptVector = multiplyMatrixWithVector(
			productMatrix,
			plaintextVector
		); //mengalikan matriks kunci dengan vektor plaintext. perkalian ini (dilakukan dalam aritmetika modulo) menghasilkan vektor baru yang mewakili teks yang telah dienkripsi.
		setdecryptText(vectorToString(decryptVector)); //mengonversi vektor numerik yang dihasilkan kembali menjadi string teks
	};

	return (
		<div>
			<input
				type="text"
				value={plaintext}
				onChange={(e) => setPlaintext(e.target.value)}
			/>
			<button onClick={decrypt}>Decrypt</button>
			<p>Decrypt Text: {decryptText}</p>
		</div>
	);
};
export default HillCipherDecrypt;