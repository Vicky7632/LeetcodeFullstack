import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

// ✅ Zod schema remains same
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

export default function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="w-full grid grid-cols-[320px_1fr] h-screen bg-base-200">
      {/* ✅ Left Navigation Sidebar Like LeetCode */}
      <aside className="bg-base-100 border-r p-6 space-y-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>

        <ul className="menu bg-base-100 rounded-lg">
          <li><a className="font-medium">Create Problem</a></li>
        </ul>
      </aside>

      {/* ✅ Main Content Like LeetCode Problem Description */}
      <main className="overflow-y-auto p-10 space-y-10">
        <h2 className="text-3xl font-semibold mb-4">Create New Problem</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* ✅ Basic Info */}
          <section className="card bg-base-100 shadow-lg p-8 rounded-xl space-y-6">
  <h3 className="text-2xl font-semibold mb-4">Basic Information</h3>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="form-control w-full">
      <label className="label font-medium">Title</label>
      <input
        {...register("title")}
        className={`input input-bordered w-full ${errors.title && "input-error"}`}
      />
      {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
    </div>

    <div className="form-control w-full lg:row-span-2">
      <label className="label font-medium">Description</label>
      <textarea
        {...register("description")}
        className={`textarea textarea-bordered h-40 w-full ${errors.description && "textarea-error"}`}
      />
      {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
    </div>

    <div className="form-control w-full">
      <label className="label font-medium">Difficulty</label>
      <select {...register("difficulty")} className="select select-bordered w-full">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <div className="form-control w-full">
      <label className="label font-medium">Tags</label>
      <select {...register("tags")} className="select select-bordered w-full">
        <option value="array">Array</option>
        <option value="linkedList">Linked List</option>
        <option value="graph">Graph</option>
        <option value="dp">DP</option>
      </select>
    </div>

  </div>
</section>

          {/* ✅ Visible Testcases */}
          <section className="card bg-base-100 shadow-lg p-8 rounded-xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                className="btn btn-primary btn-sm"
              >
                + Add Visible Case
              </button>
            </div>

            {visibleFields.map((field, index) => (
              <div key={field.id} className="bg-base-200 p-4 rounded-lg space-y-3">
                <button
                  onClick={() => removeVisible(index)}
                  type="button"
                  className="btn btn-xs btn-error float-right"
                >
                  Remove
                </button>

                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </section>

          {/* ✅ Hidden Testcases */}
          <section className="card bg-base-100 shadow-lg p-8 rounded-xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="btn btn-primary btn-sm"
              >
                + Add Hidden Case
              </button>
            </div>

            {hiddenFields.map((field, index) => (
              <div key={field.id} className="bg-base-200 p-4 rounded-lg space-y-3">
                <button
                  onClick={() => removeHidden(index)}
                  type="button"
                  className="btn btn-xs btn-error float-right"
                >
                  Remove
                </button>

                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </section>

          {/* ✅ Code Editor Templates */}
          <section className="card bg-base-100 shadow-lg p-8 rounded-xl space-y-6">
            <h3 className="text-2xl font-semibold">Code Templates</h3>

            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-lg font-medium">
                  {index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"}
                </h4>

                {/* starter code */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                <pre className="bg-base-300 p-4 rounded-lg">
                  <textarea
                    rows={6}
                    {...register(`startCode.${index}.initialCode`)}
                    className="w-full bg-transparent font-mono text-sm"
                  />
                </pre>
                </div>

                {/* reference solution */}
                <div className="form-control">
                    <label className="label">
                    <span className="label-text mb-1">Reference Solution</span>
                  </label>
                    <pre className="bg-base-300 p-4 rounded-lg">
                  <textarea
                    rows={6}
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="w-full bg-transparent font-mono text-sm"
                  />
                </pre>
                </div>
              </div>
            ))}
          </section>

          <button type="submit" className="btn btn-primary w-full py-3 text-lg">
         Create Problem
          </button>
        </form>
      </main>
    </div>
  );
}
