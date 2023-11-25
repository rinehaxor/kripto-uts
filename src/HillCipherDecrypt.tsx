import { create, all } from "mathjs";
import { useState } from "react";

const HillCipherDecrypt = () => {
	const [ciphertext, setCiphertext] = useState<string>("");
	const [decryptText, setdecryptText] = useState<string>("");
	const math = create(all);

	// menghitung koefisien kofaktor dari sebuah matriks.
	// Fungsi ini menerima parameter berupa matriks mat, dan dua indeks p dan q yang mewakili baris dan kolom elemen yang kofaktornya sedang dihitung.
	// Fungsi ini membuat sebuah matriks sementara temp dengan menghapus baris p dan kolom q dari mat.
	// Kemudian, fungsi menghitung determinan dari temp
	// Koefisien kofaktor diperoleh dengan mengalikan determinan dengan nilai 1 atau -1, tergantung pada genap atau ganjilnya jumlah dari p dan q.
	// Nilai koefisien kofaktor kemudian dikembalikan.
	const getCofactor = (mat: number[][], p: number, q: number) => {
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

	// Kode ini mendefinisikan sebuah fungsi bernama getCofactorMatrix yang menerima sebuah matriks mat sebagai input dan mengembalikan matriks kofaktor dari mat.
	// Matriks kofaktor adalah matriks persegi yang berisi kofaktor dari setiap elemen di mat.
	// Fungsi ini melakukan iterasi pada setiap elemen di mat dan menghitung kofaktornya menggunakan fungsi getCofactor.
	// Kemudian, kofaktor tersebut ditambahkan ke baris saat ini dari matriks kofaktor.
	// Terakhir, fungsi ini mengembalikan matriks kofaktor.
	const getCofactorMatrix = (mat: number[][]) => {
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

	//Kode ini mendefinisikan sebuah fungsi bernama getAdjugateMatrix yang menerima matriks mat sebagai input.
	// Fungsi ini menghitung matriks kofaktor menggunakan fungsi getCofactorMatrix
	// kemudian mengambil transpose dari matriks kofaktor.
	//Terakhir, fungsi ini mengembalikan matriks adjoin.
	const getAdjugateMatrix = (mat: number[][]) => {
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
	// memiliki 2 param key dan messageVector yang digunakan untuk menambil array 1 diemensi lalu dikalikan dengan key
	// key menggunakan array 2 dimensi sebagai contoh [[1, 2], [3, 4],[5,6]] array didalam array
	// result adalah vektor setiap elemennya adalah jumlah modulo 26
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

	// menerima 1 parameter teks yang dirubah menjadi array 1 dimensi dan menjadi huruf besar semua dengan toUppercase
	// split untuk memecah isi dari input contoh ABCD menjadi [A,B,C,D]
	//  lalu di maping ap((char) => char.charCodeAt(0) - 'A'.charCodeAt(0)):  fungsi tersebut. Untuk setiap karakter dalam array
	// 'A'.charCodeAt(0): Mengonversi  'A' menjadi kode ASCII-nya, nilai default 65.
	// char.charCodeAt(0) - 'A'.charCodeAt(0): Dengan mengurangi nilai ASCII dari 'A' dari setiap karakter, kita mengubah alfabet menjadi range 0-25 (dimana 'A' = 0, 'B' = 1, dst.).
	const stringToVector = (text: string): number[] => {
		return text
			.toUpperCase()
			.split("")
			.map((char) => char.charCodeAt(0) - "A".charCodeAt(0));
	};

	// menerima satu parameter vec dengan format angka number array[]
	// lalu maping array yang diambil dari nilai i
	// String.fromCharCode(i + 'A'.charCodeAt(0)):  ini mengonversi setiap angka dalam array kembali menjadi karakter.
	// i + 'A'.charCodeAt(0): Karena dalam proses enkripsi setiap huruf diubah menjadi angka 0-25,   menambahkan ini dengan 65 untuk mendapatkan kembali kode Ascci menggunakan String.fromCharCode(
	const vectorToString = (vec: number[]): string => {
		return vec.map((i) => String.fromCharCode(i + "A".charCodeAt(0))).join("");
	};

	// variabel key yang berisi array 2 dimensi yaitu matriks yang diberikan dibawah ini adalah 3x3
	const decrypt = () => {
		const ciphertextVector = stringToVector(ciphertext); // mengonversi string plaintext menjadi vektor numerik. Setiap huruf diubah menjadi nilai numeriknya sesuai posisi dalam alfabet (A=0, B=1, ..., Z=25
		const decryptVector = multiplyMatrixWithVector(
			productMatrix,
			ciphertextVector
		); //mengalikan matriks kunci dengan vektor plaintext. perkalian ini (dilakukan dalam aritmetika modulo) menghasilkan vektor baru yang mewakili teks yang telah dienkripsi.
		setdecryptText(vectorToString(decryptVector)); //mengonversi vektor numerik yang dihasilkan kembali menjadi string teks
	};

	return (
		<div>
			<input
				type="text"
				value={ciphertext}
				onChange={(e) => setCiphertext(e.target.value.toUpperCase())}
				maxLength={3}
			/>
			<button onClick={decrypt}>Decrypt</button>
			<p>Decrypt Text: {decryptText}</p>
		</div>
	);
};
export default HillCipherDecrypt;
