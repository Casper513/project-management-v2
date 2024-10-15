<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Http\Request;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $searchTerm = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default 10 jika tidak ada input
        $sortField = $request->input('sort_field', 'created_at'); // Default sort field
        $sortDirection = $request->input('sort_direction', 'desc'); // Default sort direction
    
        // Kolom yang bisa di-search
        $searchableColumns = ['name', 'description', 'status', 'created_by', 'updated_by'];
    
        // Query dasar
        $query = Project::query();
    
        // Jika ada search term, lakukan pencarian di kolom yang bisa di-search
        if ($searchTerm) {
            $query->where(function ($query) use ($searchTerm, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            });
        }
    
        // Terapkan sorting berdasarkan field dan direction yang diterima dari request
        $projects = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage); // Pagination sesuai request
    
        // Return data menggunakan Inertia
        return inertia('Project/Index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => $request->all(), // Mengirim semua query params
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(), // Jumlah item per halaman
                'total' => $projects->total(), // Total item
                'links' => $projects->links(), // Link pagination
            ],
            'sort' => [
                'field' => $sortField, // Mengirim field yang disortir
                'direction' => $sortDirection, // Mengirim arah sorting
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
    public function store(StoreProjectRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}