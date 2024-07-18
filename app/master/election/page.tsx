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
import type { Election } from "@/lib/definitions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fetchFromFirebase } from "@/lib/firebase/functions";
import useLocalStorageExpiration from "@/hooks/useLocalStorageExpiration";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Election", link: "/master/election" },
];

const columns: ColumnDef<Election>[] = [
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
    accessorKey: "electionType",
    header: "Election Type",
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue("electionType")}</div>
    ),
  },
  {
    accessorKey: "votingType",
    header: "Voting Type",
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue("votingType")}</div>
    ),
  },
  {
    accessorKey: "numberOfVotes",
    header: "Vote/s",
    cell: ({ row }) => (
      <div className='text-left'>{row.getValue("numberOfVotes")}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("startDate");
      const date = new Date(dateStr); // Convert to Date object
      const formattedDate = format(date, "MMMM dd, yyyy"); // Format date
      return <div className='text-left text-xs'>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const dateStr = row.getValue<string>("endDate");
      const date = new Date(dateStr); // Convert to Date object
      const formattedDate = format(date, "MMMM dd, yyyy"); // Format date
      return <div className='text-left text-xs'>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className='text-xs'>{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "candidates",
    header: "Candidates",
    cell: ({ row }) => {
      const candidates = row.getValue("candidates") as string[];
      return <div>{candidates.join(", ")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className='text-xs text-center' title={row.getValue("status")}>
        {row.getValue("status") == "active" ? "🟢" : "🔴"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const election = row.original;

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
              onClick={() => navigator.clipboard.writeText(election.id)}>
              Copy Election ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={{
                  pathname: "/master/election/update",
                  query: { id: election.id },
                }}>
                Update Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Election() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TODO: implement auto refresh
  // const { isEnabled, start, stop } = useLocalStorageExpiration(
  //   "elections",
  //   onExpired
  // );

  const table = useReactTable({
    data: elections,
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

  async function loadElections(forceRefresh: boolean = false) {
    try {
      setIsLoading(true);
      const result = await fetchFromFirebase<Election>(
        "elections",
        {
          cacheKey: "elections",
        },
        forceRefresh
      );
      setElections(result);
    } catch (e) {
      console.error("Error loading elections: ", e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  const handleRefreshElection = async () => {
    setIsRefreshing(true);
    await loadElections(true).then(() => {
      setTimeout(async () => {
        setIsRefreshing(false);
      }, 500);
    });
  };

  useEffect(() => {
    loadElections();
  }, []);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title={`Election(${elections.length || 0})`}
        description='Manages election details.'
      />
      <Separator className='mt-4' />

      <div className='w-full'>
        <div className='flex items-center py-4'>
          <Link
            title='Add new entry'
            href={"/master/election/new"}
            className={cn(buttonVariants({ variant: "default" }))}>
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
          <Button
            title='Refresh table'
            onClick={handleRefreshElection}
            variant={"outline"}
            className='ml-2'
            size={"icon"}>
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing && "animate-spin"}`}
            />
          </Button>
          {/* <Input
            placeholder='Filter by election type...'
            value={
              (table.getColumn("electionType")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("electionType")
                ?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          /> */}

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

export default Election;
