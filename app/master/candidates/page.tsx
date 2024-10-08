"use client";

import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { CandidateNext } from "@/lib/definitions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { fetchFromFirebase } from "@/lib/firebase/functions";
import Image from "next/image";
import { useMutation } from "react-query";
import axios from "axios";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidates", link: "/master/candidates" },
];

export default function Candidates() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [candidates, setCandidates] = useState<CandidateNext[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { mutate: deleteCandidate } = useMutation({
    mutationFn: (candidateId: string) => {
      return axios.delete(`/api/candidate/delete?candidateId=${candidateId}`);
    },
    onSuccess: () => {
      // Optionally handle success, e.g., refetch the table data
    },
    onError: (error) => {
      // Optionally handle error
      console.error("Error deleting candidate:", error);
    },
  });

  const columns: ColumnDef<CandidateNext>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("displayName")}</div>,
    },
    {
      accessorKey: "party",
      header: "Party",
      cell: ({ row }) => <div>{row.getValue("party")}</div>,
    },
    {
      accessorKey: "displayPhoto",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.getValue("displayPhoto")}
          alt={row.getValue("displayName") || "test"}
          height={50}
          width={50}
          className='w-10 h-10 object-cover rounded-full border'
        />
      ),
    },
    {
      accessorKey: "shortDescription",
      header: "Short Description",
      cell: ({ row }) => (
        <div className='text-xs'>
          {row.getValue("shortDescription") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "biography",
      header: "Description",
      cell: ({ row }) => (
        <div className='text-xs'>{row.getValue("biography") || "N/A"}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <DotsHorizontalIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(candidate.id.toString())
                }>
                Copy Candidate ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  prefetch={true}
                  href={`/master/candidates/update/${candidate.id}`}>
                  Update Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteCandidate(candidate.id)}
                className='text-red-600  cursor-pointer'>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: candidates,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  async function loadCandidates(forceRefresh: boolean = false) {
    try {
      setIsLoading(true);
      const result = await fetchFromFirebase<CandidateNext>(
        "candidates",
        {
          cacheKey: "candidates",
        },
        forceRefresh
      );
      setCandidates(result);
    } catch (e) {
      console.error("Error loading elections: ", e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  const handleRefreshCandidates = async () => {
    setIsRefreshing(true);
    await loadCandidates(true).then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    });
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // const deleteCandidate = useMutation({
  //   mutationFn: (candidateId: string) => {
  //     return axios.delete(`/api/candidate/delete?candidateId=${candidateId}`);
  //   },
  // });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading title='Candidate' description='Manages election candidates.' />
      <Separator className='mt-4' />

      <div className='w-full'>
        <div className='flex items-center py-4'>
          <Link
            title='Add new entry'
            href={"/master/candidates/new"}
            className={cn(buttonVariants({ variant: "default" }))}>
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
          <Button
            title='Refresh table'
            onClick={handleRefreshCandidates}
            variant={"outline"}
            className='ml-2'
            size={"icon"}>
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing && "animate-spin"}`}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            {!isLoading ? (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow className='hover:bg-transparent'>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'>
                    <div className='flex space-x-1 justify-center items-center bg-white dark:invert'>
                      <span className='sr-only'>Loading...</span>
                      <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                      <div className='h-2 w-2  bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                      <div className='h-2 w-2  bg-primary rounded-full animate-bounce'></div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
