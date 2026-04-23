import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const sanitizeFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

const resolvePublicFileUrl = (bucket, region, key) => {
	if (process.env.AWS_PUBLIC_BASE_URL) {
		return `${process.env.AWS_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
	}

	return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

const getS3Client = () => {
	if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
		throw new Error("AWS credentials are not configured for attachment uploads.");
	}

	return new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	});
};

export const createPresignedAttachmentUpload = async ({ fileName, fileType, fileSize, userId }) => {
	const bucket = process.env.AWS_S3_BUCKET;

	if (!bucket) {
		throw new Error("AWS_S3_BUCKET is not configured.");
	}

	if (!fileName || !fileType || !fileSize) {
		throw new Error("Missing attachment metadata.");
	}

	if (Number(fileSize) > MAX_UPLOAD_SIZE_BYTES) {
		throw new Error("Attachment exceeds the 5 MB upload limit.");
	}

	const safeFileName = sanitizeFileName(fileName);
	const objectKey = `${userId}/${Date.now()}-${randomUUID()}-${safeFileName}`;
	const s3Client = getS3Client();
	const uploadCommand = new PutObjectCommand({
		Bucket: bucket,
		Key: objectKey,
		ContentType: fileType,
	});

	const uploadUrl = await getSignedUrl(s3Client, uploadCommand, {
		expiresIn: 300,
	});
	const publicUrl = resolvePublicFileUrl(bucket, process.env.AWS_REGION, objectKey);

	return {
		uploadUrl,
		attachment: {
			url: publicUrl,
			key: objectKey,
			name: safeFileName,
			mimeType: fileType,
			size: Number(fileSize),
			kind: fileType.startsWith("image/") ? "image" : "file",
		},
	};
};
