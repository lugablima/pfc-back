import { prisma } from "../config/prisma";
import { CreateModule, TModule } from "../types/moduleTypes";

export async function findOneById(id: string): Promise<TModule | null> {
  const module: TModule | null = await prisma.module.findUnique({ where: { id } });

  return module;
}

export async function findOneByName(name: string, distinctId?: string): Promise<TModule | null> {
  let module: TModule | null;

  if (distinctId) {
    module = await prisma.module.findUnique({
      where: { name, AND: { id: { not: distinctId } } },
    });

    return module;
  }

  module = await prisma.module.findUnique({
    where: { name },
  });

  return module;
}

export async function getAll() {
  const modules = await prisma.module.findMany({
    orderBy: { sequence: "asc" },
    select: {
      id: true,
      name: true,
      sequence: true,
      description: true,
      imageUrl: true,
      isEnabled: true,
      createdAt: true,
    },
  });

  return modules;
}

export async function getModuleInfoForEdit(moduleId: string) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      name: true,
      sequence: true,
      description: true,
      imageUrl: true,
      classes: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
          name: true,
          sequence: true,
          imageUrl: true,
          dueDate: true,
          video: { select: { url: true } },
          summary: { select: { url: true } },
          exercises: {
            orderBy: { sequence: "asc" },
            select: {
              id: true,
              name: true,
              statement: true,
              tests: {
                orderBy: { createdAt: "asc" },
                select: { id: true, inputs: true, result: true, inputDataType: true, resultDataType: true },
              },
            },
          },
        },
      },
    },
  });

  return module;
}

export async function insertOne(module: CreateModule): Promise<TModule> {
  const createdModule = await prisma.module.create({ data: { ...module } });

  return createdModule;
}

export async function updateOneIsEnabled(moduleId: string, isEnabled: boolean): Promise<TModule> {
  const moduleUpdated = await prisma.module.update({
    where: { id: moduleId },
    data: { isEnabled },
  });

  return moduleUpdated;
}

export async function findOneByIdAndIsEnabled(moduleId: string, isEnabled: boolean): Promise<TModule | null> {
  const module = await prisma.module.findUnique({
    where: { id: moduleId, AND: { isEnabled } },
  });

  return module;
}

export async function deleteOne(moduleId: string): Promise<void> {
  await prisma.module.delete({
    where: { id: moduleId },
    include: { classes: { where: { moduleId } } },
  });
}
