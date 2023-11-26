// HillCipher.tsx

import { useState } from "react";
import { Button } from "./component/Button";
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
import { key } from "./constant/key";

const HillCipher = () => {
	const [encryptedText, setEncryptedText] = useState<string>("");

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
	const encrypt = (plaintext: string) => {
		const plaintextVector = stringToVector(plaintext); // mengonversi string plaintext menjadi vektor numerik. Setiap huruf diubah menjadi nilai numeriknya sesuai posisi dalam alfabet (A=0, B=1, ..., Z=25
		const encryptedVector = multiplyMatrixWithVector(key, plaintextVector); //mengalikan matriks kunci dengan vektor plaintext. perkalian ini (dilakukan dalam aritmetika modulo) menghasilkan vektor baru yang mewakili teks yang telah dienkripsi.
		setEncryptedText(vectorToString(encryptedVector)); //mengonversi vektor numerik yang dihasilkan kembali menjadi string teks
	};
	const FormSchema = z.object({
		plaintext: z
			.string()
			.min(3, {
				message: "Harus 3 Huruf",
			})
			.max(3, {
				message: "Maksimal 3 Huruf",
			}),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			plaintext: "",
		},
	});
	function onSubmit(data: z.infer<typeof FormSchema>) {
		encrypt(data.plaintext);
	}

	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
					<FormField
						control={form.control}
						name="plaintext"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase font-bold">Enkripsi :</FormLabel>
								<FormControl>
									<Input placeholder="Plain Text" {...field} maxLength={3} />
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<Button className="bg-blue-500 text-white" type="submit">
						Enkrip
					</Button>
				</form>
			</Form>
			<div className="flex gap-5 my-5 font-bold">
				<h1 className="uppercase">hasil enkripsi</h1> : <p>{encryptedText}</p>
			</div>
		</div>
	);
};

export default HillCipher;
