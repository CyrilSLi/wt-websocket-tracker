#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

async function main() {
    const file = process.argv[2];

    if (!file) {
        console.error(`Usage: ${path.basename(process.argv[1])} <file>`);
        process.exit(1);
    }

    const original = await fs.readFile(file);

    // Compress
    const compressed = Buffer.from(
        await new Response(
            new ReadableStream({
                start(controller) {
                    controller.enqueue(new Uint8Array(original));
                    controller.close();
                }
            }).pipeThrough(new CompressionStream("deflate"))
        ).arrayBuffer()
    );

    // Save compressed data as Base64 text
    const compressedFile = file + ".deflate.b64";
    await fs.writeFile(compressedFile, compressed.toString("base64"), "utf8");

    // Read it back
    const compressedBase64 = await fs.readFile(compressedFile, "utf8");
    const compressedFromFile = Buffer.from(compressedBase64, "base64");

    // Decompress
    const decompressed = Buffer.from(
        await new Response(
            new ReadableStream({
                start(controller) {
                    controller.enqueue(new Uint8Array(compressedFromFile));
                    controller.close();
                }
            }).pipeThrough(new DecompressionStream("deflate"))
        ).arrayBuffer()
    );

    const identical = original.equals(decompressed);

    console.log(`Original size:      ${original.length}`);
    console.log(`Compressed size:    ${compressed.length}`);
    console.log(`Base64 size:        ${compressedBase64.length}`);
    console.log(`Output file:        ${compressedFile}`);
    console.log(`Verification:       ${identical ? "PASS" : "FAIL"}`);

    if (!identical) {
        process.exit(2);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});