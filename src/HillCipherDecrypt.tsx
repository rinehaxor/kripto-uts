import { useState } from "react";
import { key } from "./constant/key";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./component/Form";
import { Input } from "./component/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { Button } from "./component/Button";
function HillCipherDecryptor() {
	const [decryptedText, setDecryptedText] = useState("");

	// Contoh matriks invers kunci (anda harus menghitungnya sesuai dengan kunci Anda)
	function mod(n: number, m: number) {
		return ((n % m) + m) % m;
	}

	// Potongan kode ini mendefinisikan sebuah fungsi yang disebut modInverse yang menghitung invers modular dari suatu bilangan a terhadap modulus m.
	// Fungsi ini menggunakan perulangan untuk mengiterasi nilai x yang mungkin dan memeriksa apakah hasil modulo dari a * x terhadap m sama dengan 1.
	//Jika ditemukan kecocokan, fungsi mengembalikan nilai x. Jika tidak ditemukan kecocokan, fungsi mengembalikan nilai 1, yang menandakan bahwa matriks kunci harus memiliki invers.
	function modInverse(a: number, m: number) {
		a = mod(a, m);
		for (let x = 1; x < m; x++) {
			if (mod(a * x, m) === 1) {
				return x;
			}
		}
		return 1; // Matriks kunci harus memiliki invers
	}

	// Potongan kode ini mendefinisikan sebuah fungsi bernama charToInt yang menerima sebuah string c sebagai input.
	// Fungsi ini mengubah string input menjadi huruf kapital menggunakan metode toUpperCase() dan kemudian mengambil kode ASCII dari karakter pertama menggunakan metode charCodeAt(0).
	// Selanjutnya, kode ASCII dari karakter "A" dikurangkan dari kode ASCII yang didapatkan untuk mendapatkan representasi numerik dari karakter antara 0 dan 25 (asumsi input adalah huruf).
	function charToInt(c: string) {
		return c.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
	}

	// Potongan kode ini mendefinisikan sebuah fungsi bernama intToChar yang menerima sebuah angka sebagai input.
	// Fungsi ini mengonversi angka tersebut menjadi sebuah karakter dengan melakukan beberapa perhitungan dan mengembalikan karakter tersebut.
	// Karakternya ditentukan dengan menambahkan kode ASCII dari huruf kapital "A" dengan sisa hasil bagi angka input dibagi 26.
	function intToChar(i: number) {
		return String.fromCharCode((i % 26) + "A".charCodeAt(0));
	}

	// Potongan kode ini mendefinisikan sebuah fungsi bernama decryptHillCipher yang menerima sebuah teks terenkripsi dan sebuah matriks kunci sebagai input.
	// Fungsi ini melakukan dekripsi dari sebuah Hill cipher, yang merupakan sebuah substitusi cipher yang beroperasi pada blok-blok huruf.
	// Teks yang telah didekripsi dikembalikan oleh fungsi ini.
	function decryptHillCipher(encryptedText: string, keyMatrix: number[][]) {
		let decryptedText = "";

		// Menghitung determinan
		const det =
			keyMatrix[0][0] *
				(keyMatrix[1][1] * keyMatrix[2][2] - keyMatrix[1][2] * keyMatrix[2][1]) -
			keyMatrix[0][1] *
				(keyMatrix[1][0] * keyMatrix[2][2] - keyMatrix[1][2] * keyMatrix[2][0]) +
			keyMatrix[0][2] *
				(keyMatrix[1][0] * keyMatrix[2][1] - keyMatrix[1][1] * keyMatrix[2][0]);

		// Menghitung invers matriks determinan
		const detInv = modInverse(det, 26);

		// Menghitung matriks adjoin
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

		// Menghitung matriks invers determinan dengan mengalikan matriks adjoin dengan invers modular
		const inverseMatrix = adj.map((row) => row.map((el) => mod(el * detInv, 26)));

		// Menghitung vektor nilai numerik dari teks terenkripsi dalam blok-blok tiga karakter
		for (let i = 0; i < encryptedText.length; i += 3) {
			const vector = [0, 0, 0];
			for (let j = 0; j < 3; j++) {
				vector[j] = charToInt(encryptedText[i + j]);
			}

			// Menghitung vektor nilai numerik yang didekripsikan
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const resultVector: any[] = [0, 0, 0];
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					resultVector[j] = mod(
						resultVector[j] + inverseMatrix[j][k] * vector[k],
						26
					);
				}
				resultVector[j] = intToChar(resultVector[j]);
			}
			// Menyusun teks yang telah didekripsi
			decryptedText += resultVector.join("");
		}
		// Mengembalikan teks yang telah didekripsi
		return decryptedText;
	}

	// Schema validation
	const FormSchema = z.object({
		ciphertext: z
			.string()
			.min(3, {
				message: "Harus 3 Huruf",
			})
			.max(3, {
				message: "Maksimal 3 Huruf",
			}),
	});

	// form validation
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			ciphertext: "",
		},
	});

	// form submit
	function onSubmit(data: z.infer<typeof FormSchema>) {
		const result = decryptHillCipher(data.ciphertext, key);
		setDecryptedText(result);
	}
	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
					<FormField
						control={form.control}
						name="ciphertext"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase font-bold">Dekripsi :</FormLabel>
								<FormControl>
									<Input placeholder="Cipher Text" {...field} maxLength={3} />
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<Button className="bg-red-500 text-white" type="submit">
						Dekrip
					</Button>
				</form>
			</Form>
			<div className="flex gap-5 my-5 font-bold">
				<h1 className="uppercase">hasil dekripsi</h1> : <p>{decryptedText}</p>
			</div>
		</div>
	);
}

export default HillCipherDecryptor;
