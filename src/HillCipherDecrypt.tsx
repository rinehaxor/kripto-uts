import { useState } from "react";

function HillCipherDecryptor() {
	const [encryptedText, setEncryptedText] = useState("");
	const [decryptedText, setDecryptedText] = useState("");

	// Contoh matriks invers kunci (anda harus menghitungnya sesuai dengan kunci Anda)
	const inverseKey = [
		[2, 8, 15],
		[7, 4, 17],
		[8, 13, 6],
	];
	function mod(n: number, m: number) {
		return ((n % m) + m) % m;
	}
	function modInverse(a: number, m: number) {
		a = mod(a, m);
		for (let x = 1; x < m; x++) {
			if (mod(a * x, m) === 1) {
				return x;
			}
		}
		return 1; // Matriks kunci harus memiliki invers
	}

	function charToInt(c: string) {
		return c.charCodeAt(0) - "A".charCodeAt(0);
	}

	function intToChar(i: number) {
		console.log(String.fromCharCode((i % 26) + "A".charCodeAt(0)));

		return String.fromCharCode((i % 26) + "A".charCodeAt(0));
	}

	function decryptHillCipher(encryptedText: string, keyMatrix: number[][]) {
		let decryptedText = "";

		// Menghitung determinan matriks kunci
		const det =
			keyMatrix[0][0] *
				(keyMatrix[1][1] * keyMatrix[2][2] - keyMatrix[1][2] * keyMatrix[2][1]) -
			keyMatrix[0][1] *
				(keyMatrix[1][0] * keyMatrix[2][2] - keyMatrix[1][2] * keyMatrix[2][0]) +
			keyMatrix[0][2] *
				(keyMatrix[1][0] * keyMatrix[2][1] - keyMatrix[1][1] * keyMatrix[2][0]);

		const detInv = modInverse(det, 26);

		// Menghitung invers matriks
		const adj = [
			[
				(keyMatrix[1][1] * keyMatrix[2][2] - keyMatrix[2][1] * keyMatrix[1][2]) %
					26,
				(keyMatrix[0][2] * keyMatrix[2][1] - keyMatrix[0][1] * keyMatrix[2][2]) %
					26,
				(keyMatrix[0][1] * keyMatrix[1][2] - keyMatrix[0][2] * keyMatrix[1][1]) %
					26,
			],
			[
				(keyMatrix[1][2] * keyMatrix[2][0] - keyMatrix[1][0] * keyMatrix[2][2]) %
					26,
				(keyMatrix[0][0] * keyMatrix[2][2] - keyMatrix[0][2] * keyMatrix[2][0]) %
					26,
				(keyMatrix[1][0] * keyMatrix[0][2] - keyMatrix[0][0] * keyMatrix[1][2]) %
					26,
			],
			[
				(keyMatrix[1][0] * keyMatrix[2][1] - keyMatrix[2][0] * keyMatrix[1][1]) %
					26,
				(keyMatrix[2][0] * keyMatrix[0][1] - keyMatrix[0][0] * keyMatrix[2][1]) %
					26,
				(keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[1][0] * keyMatrix[0][1]) %
					26,
			],
		];

		const inverseMatrix = adj.map((row) => row.map((el) => mod(el * detInv, 26)));

		for (let i = 0; i < encryptedText.length; i += 3) {
			const vector = [0, 0, 0];
			for (let j = 0; j < 3; j++) {
				vector[j] = charToInt(encryptedText[i + j]);
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const resultVector: any[] = [0, 0, 0];
			console.log({ resultVector });

			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					resultVector[j] = mod(
						resultVector[j] + inverseMatrix[j][k] * vector[k],
						26
					);
				}
				resultVector[j] = intToChar(resultVector[j]);
			}

			decryptedText += resultVector.join("");
		}

		return decryptedText;
	}

	const handleDecrypt = () => {
		const result = decryptHillCipher(encryptedText, inverseKey);
		setDecryptedText(result);
	};

	return (
		<div>
			<h2>Hill Cipher Decryptor</h2>
			<input
				type="text"
				value={encryptedText}
				onChange={(e) => setEncryptedText(e.target.value)}
				placeholder="Enter encrypted text"
			/>
			<button onClick={handleDecrypt}>Decrypt</button>
			<p>Decrypted Text: {decryptedText}</p>
		</div>
	);
}

export default HillCipherDecryptor;
