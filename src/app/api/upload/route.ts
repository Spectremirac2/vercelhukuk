import { NextRequest, NextResponse } from "next/server";
import { geminiClient } from "@/utils/gemini-client";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

// 10MB limit for now
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to temp file because SDK usually expects path or standard file input
    // The new SDK might handle streams/blobs but saving to temp is safest for now.
    const tempFilePath = join(tmpdir(), `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    try {
        // Upload to Gemini
        const uploadResponse = await geminiClient.files.upload({
            file: tempFilePath,
            config: {
                displayName: file.name,
                mimeType: file.type
            }
        });

        console.log("File uploaded to Gemini:", uploadResponse);

        // In a real app, we would add this to a File Search Store here.
        // For this MVP, let's create a store for each session or a global one?
        // Better: Create a global "LegalDocs" store or just let the client manage file URIs
        // IF we use "files" API directly.
        // BUT File Search requires a "File Search Store" usually.
        // Let's check if we can just pass file URIs to generateContent directly?
        // Docs say: "The Gemini API enables Retrieval Augmented Generation ("RAG") through the File Search tool... This information is then used as context... specify a FileSearchRetrievalResource, which points to the FileSearchStore"

        // So we MUST use a FileSearchStore.
        // Let's create one if not exists or use a default one.
        // For simplicity, let's create a NEW store for this user/session if we want isolation,
        // or a shared one.
        // Let's try to return the URI and handle Store creation in the chat logic or here.

        // Actually, to make it usable immediately, let's put it in a store.
        // But the client might want to remove it.
        // Let's return the file URI and Name, and handle Store operations when chatting or allow "Indexing" step.

        // BETTER APPROACH for MVP:
        // 1. Upload File -> Get URI.
        // 2. Client sends list of URIs to Chat API.
        // 3. Chat API creates a temporary Store (or reuses one) with these files.
        // Wait, creating a store for every request is slow.
        // Let's create a Store when the *First* file is uploaded, return store ID.
        // Subsequent uploads go to that store.

        // Let's assume the client sends a `storeId` if it has one.
        const storeId = formData.get("storeId") as string;

        let targetStoreId = storeId;

        if (!targetStoreId) {
            const store = await geminiClient.fileSearchStores.create({
                config: { displayName: `Session-${Date.now()}` }
            });
            targetStoreId = store.name || ""; // e.g. "fileSearchStores/..."
        }

        // Import the file into the store
        // We use importFile (which links the uploaded file to the store)
        // or upload directly to store. Since we already uploaded to `files`, we use `importFile` equivalent
        // OR we should have used `uploadToFileSearchStore`.

        // Since we already uploaded (let's say), we need to add it.
        // Actually, `files.upload` creates a `File`.
        // We need to associate it with the store.
        // The SDK has `fileSearchStores.importFile`?
        // Let's check SDK methods from my memory or the bash output earlier.
        // `importFile` was in the docs I just read.

        await geminiClient.fileSearchStores.importFile({
            fileSearchStoreName: targetStoreId,
            fileName: uploadResponse.name || "" // The resource name e.g. "files/..."
        });

        // Clean up temp file
        await unlink(tempFilePath);

        return NextResponse.json({
            success: true,
            file: {
                name: uploadResponse.name, // "files/123..."
                displayName: uploadResponse.displayName,
                uri: uploadResponse.uri
            },
            storeId: targetStoreId
        });

    } catch (apiError) {
        console.error("Gemini API Error:", apiError);
        await unlink(tempFilePath).catch(() => {}); // Ensure cleanup
        return NextResponse.json({ error: "Failed to upload to Gemini" }, { status: 500 });
    }

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
