<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default 10 jika tidak ada input
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
    
        $searchableColumns = ['name', 'description', 'status', 'created_by', 'updated_by'];
    
        $query = Task ::query();
    
        if ($searchTerm) {
            $query->where(function ($query) use ($searchTerm, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            });
        }
    
        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage); // Menggunakan perPage dari request
    
        return inertia('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => $request->all(),
            'pagination' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(), // Tambahkan per_page di sini
                'total' => $tasks->total(), // Menampilkan total item
                'links' => $tasks->links(),
            ],
        ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
