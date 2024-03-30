import prisma from '../utils/prisma.js';

export async function checkDossierCapacity(req, res) {
	try {
		const result = await prisma.settings.findMany({
			where: {
				name: { contains: 'cap' },
			},
			select: { name: true, value: true },
		});

		const caps = result.map(i => ({
			drug: i.name.replace('cap_', ''),
			cap: i.value,
		}));

		let b2 = 0,
			metadon = 0,
			opium = 0;

		const result2 = await prisma.dossier.findMany({
			where: { inQueue: false },
		});

		result2.forEach(d => {
			switch (d.drugType) {
				case 'B2':
					b2++;
					return;
				case 'Metadon':
					metadon++;
					return;
				case 'Opium':
					opium++;
					return;
				default:
					return;
			}
		});

		res.status(201).json({
			data: [
				{ drug: 'b2', cap: caps?.find(c => c.drug == 'b2').cap - b2 },
				{
					drug: 'metadon',
					cap: caps?.find(c => c.drug == 'metadon').cap - metadon,
				},
				{
					drug: 'opium',
					cap: caps?.find(c => c.drug == 'opium').cap - opium,
				},
			],
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function checkDrugCapacity(req, res) {
	try {
		const result = await prisma.settings.findMany({
			where: {
				name: { contains: 'cap' },
			},
			select: { name: true, value: true },
		});

		res.status(200).json({
			data: result.map(i => ({
				drug: i.name.replace('cap_', ''),
				cap: i.value,
			})),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function setDrugCapacity(req, res) {
	try {
		const { B2, Opium, Metadon } = req.body;

		if (typeof B2 !== 'undefined') {
			const B2Id = await prisma.settings.findFirst({
				where: { name: 'cap_b2' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: B2Id?.id },
				data: { value: B2.toString() },
			});
		}

		if (typeof Metadon !== 'undefined') {
			const MetadonId = await prisma.settings.findFirst({
				where: { name: 'cap_metadon' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: MetadonId?.id },
				data: { value: Metadon.toString() },
			});
		}

		if (typeof Opium !== 'undefined') {
			const OpiumId = await prisma.settings.findFirst({
				where: { name: 'cap_opium' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: OpiumId?.id },
				data: { value: Opium.toString() },
			});
		}

		res.status(202).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function createDossier(req, res) {
	try {
		const { patientId, drugType, inQueue, number } = req.body;
		//TODO: check for duplicate dossiers - handled in frontend
		await prisma.dossier.create({
			data: {
				patientId: patientId,
				drugType: drugType,
				state: 'Active',
				inQueue: inQueue,
				dossierNumber: number ? number : null,
			},
		});
		res.status(201).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function findDossier(req, res) {
	try {
		const { query } = req.params;
		const { queue } = req.query;
		const result = await prisma.dossier.findMany({
			where: {
				inQueue: queue ? true : false,
				OR: [
					{
						patient: {
							OR: [
								{ firstName: { contains: query } },
								{ lastName: { contains: query } },
								{ nationalID: { contains: query } },
								{ phone: { contains: query } },
							],
						},
					},
					{ dossierNumber: { contains: query } },
				],
			},
			select: {
				patient: {
					select: {
						firstName: true,
						lastName: true,
						id: true,
					},
				},
				id: true,
				dossierNumber: true,
				drugType: true,
			},
		});

		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function findDossierForNewReception(req, res) {
	try {
		const { query } = req.params;
		const result = await prisma.dossier.findMany({
			where: {
				OR: [
					{ dossierNumber: { contains: query } },
					{
						patient: {
							OR: [
								{ firstName: { contains: query } },
								{ lastName: { contains: query } },
								{ phone: { contains: query } },
								{ nationalID: { contains: query } },
							],
						},
					},
				],
			},
			select: {
				id: true,
				dossierNumber: true,
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						nationalID: true,
					},
				},
			},
		});

		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getSingleDossier(req, res) {
	try {
		const { id } = req.params;
		const result = await prisma.dossier.findFirst({
			where: { id: { equals: parseInt(id) } },
			include: {
				patient: true,
				records: true,
				attachments: true,
			},
		});
		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getAllDossiers(req, res) {
	try {
		const { queue } = req.query;

		const result = await prisma.dossier.findMany({
			where: {
				inQueue: queue ? true : false,
			},
			include: {
				patient: {
					select: { firstName: true, lastName: true, phone: true },
				},
			},
		});
		res.status(201).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function updateDossier(req, res) {
	try {
		const { id } = req.params;
		const result = await prisma.dossier.update({
			where: { id: parseInt(id) },
			data: req.body,
		});
		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteDossier(req, res) {
	try {
		const { id } = req.params;
		res.status(200).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
