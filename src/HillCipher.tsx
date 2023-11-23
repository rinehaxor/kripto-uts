// HillCipher.tsx

import React, { useState } from 'react';

const HillCipher = () => {
   const [plaintext, setPlaintext] = useState<string>('');
   const [encryptedText, setEncryptedText] = useState<string>('');

   // Fungsi untuk mengalikan matriks kunci dengan vektor teks
   const multiplyMatrixWithVector = (key: number[][], messageVector: number[]): number[] => {
      const result: number[] = new Array(messageVector.length).fill(0);

      for (let i = 0; i < messageVector.length; i++) {
         for (let j = 0; j < messageVector.length; j++) {
            result[i] += key[i][j] * messageVector[j];
         }
         result[i] %= 26;
      }

      return result;
   };

   // Fungsi untuk mengubah string menjadi vektor integer
   const stringToVector = (text: string): number[] => {
      return text
         .toUpperCase()
         .split('')
         .map((char) => char.charCodeAt(0) - 'A'.charCodeAt(0));
   };

   // Fungsi untuk mengubah vektor integer menjadi string
   const vectorToString = (vec: number[]): string => {
      return vec.map((i) => String.fromCharCode(i + 'A'.charCodeAt(0))).join('');
   };

   // Fungsi untuk melakukan enkripsi menggunakan Hill Cipher
   const encrypt = () => {
      const key: number[][] = [
         [6, 24, 1],
         [13, 16, 10],
         [20, 17, 15],
      ];

      const plaintextVector = stringToVector(plaintext);
      const encryptedVector = multiplyMatrixWithVector(key, plaintextVector);
      setEncryptedText(vectorToString(encryptedVector));
   };

   return (
      <div>
         <input type="text" value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
         <button onClick={encrypt}>Encrypt</button>
         <p>Encrypted Text: {encryptedText}</p>
      </div>
   );
};

export default HillCipher;
