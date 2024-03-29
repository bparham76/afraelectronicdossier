import prisma from '../utils/prisma.js';
import fs from 'fs/promises';
import path from 'path/win32';

export async function createAttachment(req, res) {
	try {
		const cargo = req.file;
		const { id, type, title } = req.body;
		if (type === 'patient') {
			await prisma.attachment.create({
				data: {
					title: title,
					fileAddress: cargo.filename,
					patient: { connect: { id: parseInt(id) } },
				},
			});
		} else if (type === 'dossier') {
			await prisma.attachment.create({
				data: {
					title: title,
					fileAddress: cargo.filename,
					dossier: { connect: { id: parseInt(id) } },
				},
			});
		} else res.status(500).json();

		res.status(201).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteAttachment(req, res) {
	try {
		const { id } = req.params;
		const attachment = await prisma.attachment.delete({
			where: { id: parseInt(id) },
		});
		await fs.unlink(path.join('attachments', attachment.fileAddress));
		res.status(204).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
